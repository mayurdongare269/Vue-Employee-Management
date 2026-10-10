using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyFirstApi.Data;
using MyFirstApi.Dto;
using MyFirstApi.IService;

namespace MyFirstApi.Services // services are mainly used for clean and organise controller codes...
{
    public class AuthService : IAuthService // we use interface beacuase its give security by not showing implementation
    {
        private readonly AppDbContext _context;
        public AuthService(AppDbContext context)
        {
            this._context = context;
        }

        
        public async Task<Tuple<int, string>> LoginUser(UserDto dto)
        {
            try
            {
                var existingUser = await _context.AccountUsers.FirstOrDefaultAsync(x => x.Email == dto.Email); //return value or null

                if(existingUser == null)
                {
                    return new Tuple<int, string>(0, "This user not exists, please login");
                } 

                
                // basic...
                var passwordHasher = new PasswordHasher<string>();

                var verifyPassword = passwordHasher.VerifyHashedPassword(
                    dto.Email,
                    existingUser.Password,
                    dto.Password
                );

                if (verifyPassword == PasswordVerificationResult.Success)
                {
                    return new Tuple<int, string>(2, "Login Successful");
                }
                else if (verifyPassword == PasswordVerificationResult.SuccessRehashNeeded)
                {
                    existingUser.Password = PasswordHashing(dto);

                    _context.AccountUsers.Update(existingUser);
                    _context.SaveChanges();

                    return new Tuple<int, string>(2, "Login Successful, New Hash Generated");
                }
                else if (verifyPassword == PasswordVerificationResult.Failed)
                {
                    return new Tuple<int, string>(1, "Password Incorrect");
                }

                return new Tuple<int, string>(1, "Password Incorrect");

            } catch (Exception)
            {
                throw;
            }
        }

        public async Task<Tuple<int, string>> RegisterUser(UserDto dto)
        {
            try
            {
                var existingUser = await _context.AccountUsers.AnyAsync(x => x.Email == dto.Email); // return true or false..

                if(existingUser)
                {
                    return new Tuple<int, string>(0, "This user is already exists...");
                } 

                _context.AccountUsers.Add(new Entities.User
                {
                   Id = Guid.NewGuid(),
                   Name = dto.Name,
                   Email = dto.Email,
                   Password = PasswordHashing(dto)
                });

                await _context.SaveChangesAsync();


                return new Tuple<int, string>(1, "User Registered Successfully... ");
            }
            catch (System.Exception)
            {
                
                throw;
            }
        }

        private string PasswordHashing(UserDto dto)
        {
            var passwordHasher = new PasswordHasher<string>();

            var hash = passwordHasher.HashPassword(dto.Email, dto.Password);

            return hash;
        }
    }
}