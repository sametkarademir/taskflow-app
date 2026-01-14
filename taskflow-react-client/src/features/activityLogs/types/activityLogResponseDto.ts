export interface ActivityLogResponseDto {
  id: string;
  actionKey: string;
  oldValue?: string;
  newValue?: string;
  userId: string;
  todoItemId: string;
  creationTime: string;
  creatorId: string;
}
