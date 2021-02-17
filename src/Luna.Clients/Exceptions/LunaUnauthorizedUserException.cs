﻿namespace Luna.Clients.Exceptions
{
    public class LunaUnauthorizedUserException : LunaUserException
    {
        public LunaUnauthorizedUserException(string message):
            base(message, UserErrorCode.Unauthorized, System.Net.HttpStatusCode.Unauthorized)
        {

        }
    }
}
