﻿using System;
using Luna.Services.WebHook;

namespace Luna.Services.Utilities
{
    public class NotificationModel 
    {
        public Guid SubscriptionId { get; set; }
        public string PlanId { get; set; }
        public string OperationType { get; set; }
        public Guid OperationId { get; set; }
        public int Quantity { get; set; }
        public string PublisherId { get; set; }
        public string OfferId { get; set; }

        public static NotificationModel FromWebhookPayload(WebhookPayload payload)
        {
            return new NotificationModel
            {
                OfferId = payload.OfferId,
                OperationId = payload.Id,
                PlanId = payload.PlanId,
                PublisherId = payload.PublisherId,
                Quantity = payload.Quantity,
                SubscriptionId = payload.SubscriptionId
            };
        }
    }
}