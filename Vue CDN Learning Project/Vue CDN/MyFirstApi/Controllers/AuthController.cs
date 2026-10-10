using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using MyFirstApi.IService;
using System.Runtime.CompilerServices;
using Microsoft.EntityFrameworkCore.Internal;
using MyFirstApi.Entities;
using MyFirstApi.Dto;
using MyFirstApi.GenericResponse;

namespace MyFirstApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authSerice)
        {
            this._authService = authSerice;
        }

        // here FromBody... its model binding
        // and its used to send parameters in json
        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody]UserDto userDto) // we use the AuthService.cs and here we implement final logic using status codes....
        {
            try
            {
                var result = await _authService.LoginUser(userDto);

                if(result.Item1 == 0)
                {
                    return NotFound(ResponseResult<string>.Failure(null, result.Item2));
                }

                if(result.Item1 == 1)
                {
                    return BadRequest(ResponseResult<string>.Failure(null, result.Item2));
                }

                return Ok(result.Item2);
            } catch (Exception)
            {
                throw;
            }
        } 

        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] UserDto userDto)
        {
            try
            {
                var result = await _authService.RegisterUser(userDto);

                if (result.Item1 == 0)
                {
                    return Ok(ResponseResult<string>.Failure(null, result.Item2));
                }

                return Ok(ResponseResult<string>.Success(null, result.Item2));
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}