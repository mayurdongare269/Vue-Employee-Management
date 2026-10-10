namespace MyFirstApi.Dto
{
    public class UserDto
    {
        public Guid Id {get; set;} // Globally Unique Identifier.
         public string Name {get; set;} = null!;
        public string Email {get; set; } = null!;
        public string Password {get; set;} = null!;
    }
}