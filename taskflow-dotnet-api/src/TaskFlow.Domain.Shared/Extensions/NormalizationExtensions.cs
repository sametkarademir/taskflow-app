using System.Globalization;
using System.Linq;
using System.Text;

namespace TaskFlow.Domain.Shared.Extensions;

public static class NormalizationExtensions
{
    public static string NormalizeValue(this string value)
    {
        if (string.IsNullOrEmpty(value))
        {
            return value;
        }

        value = value.Normalize(NormalizationForm.FormD);
        var chars = value.Where(c => CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark).ToArray();
        value = new string(chars).Normalize(NormalizationForm.FormC);
        
        // Convert to uppercase using Turkish culture to handle Turkish characters correctly
        value = value.ToUpper(new CultureInfo("tr-TR"));
        
        // Turkish character mapping to ASCII equivalents
        var turkishMap = new Dictionary<char, char>
        {
            { 'İ', 'I' },
            { 'Ş', 'S' },
            { 'Ğ', 'G' },
            { 'Ü', 'U' },
            { 'Ö', 'O' },
            { 'Ç', 'C' }
        };
        
        var normalizedChars = value.Select(c => turkishMap.ContainsKey(c) ? turkishMap[c] : c).ToArray();
        
        return new string(normalizedChars);
    }
}