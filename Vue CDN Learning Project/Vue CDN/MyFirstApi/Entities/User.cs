using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.SignalR;

namespace MyFirstApi.Entities
{
    public class User
    {
        [Key]
        public Guid Id {get; set;} = Guid.NewGuid(); // Globally Unique Identifier.

        // public string name {get; set;} = null!;
         public string? Name {get; set;}
        public string Email {get; set; }  = null!;
        public string Password { get; set; } = null!;
    }
}