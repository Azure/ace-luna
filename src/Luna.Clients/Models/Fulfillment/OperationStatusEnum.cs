﻿namespace Luna.Clients.Models.Fulfillment
{
    /// <summary>
    /// Indicates the status of the operation
    /// </summary>
    public enum OperationStatusEnum
    {
        NotStarted,
        InProgress,
        Failed,
        Succeeded,
        Conflict
    }
}
