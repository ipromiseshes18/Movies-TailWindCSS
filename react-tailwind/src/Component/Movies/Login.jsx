import React, { useState } from "react";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = (userName, password) => {};
  return (
    <div>
      <input
        type="text"
        placeholder="Username..."
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Password..."
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button>Login</button>
      <button>Register</button>
    </div>
  );
};

export default Login;
// import React, { useState } from "react";

// const Login = () => {
//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//   });
//   const [isRegistering, setIsRegistering] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     // 基础验证
//     if (!formData.username || !formData.password) {
//       setError("请填写所有必填字段");
//       return;
//     }

//     if (formData.password.length < 6) {
//       setError("密码至少需要6个字符");
//       return;
//     }

//     try {
//       setIsLoading(true);
//       // 模拟API调用
//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       if (isRegistering) {
//         // 注册逻辑
//         console.log("注册成功:", formData);
//       } else {
//         // 登录逻辑
//         console.log("登录成功:", formData);
//       }
//     } catch (err) {
//       setError("请求失败，请稍后重试");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
//         {isRegistering ? "用户注册" : "用户登录"}
//       </h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label
//             htmlFor="username"
//             className="block text-sm font-medium text-gray-700"
//           >
//             用户名
//           </label>
//           <input
//             type="text"
//             id="username"
//             name="username"
//             value={formData.username}
//             onChange={handleInputChange}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
//                      focus:border-blue-500 focus:ring-blue-500"
//             placeholder="请输入用户名"
//             disabled={isLoading}
//           />
//         </div>

//         <div>
//           <label
//             htmlFor="password"
//             className="block text-sm font-medium text-gray-700"
//           >
//             密码
//           </label>
//           <input
//             type="password"
//             id="password"
//             name="password"
//             value={formData.password}
//             onChange={handleInputChange}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
//                      focus:border-blue-500 focus:ring-blue-500"
//             placeholder="请输入密码（至少6位）"
//             disabled={isLoading}
//           />
//         </div>

//         {error && (
//           <div className="text-red-600 text-sm text-center">{error}</div>
//         )}

//         <button
//           type="submit"
//           disabled={isLoading}
//           className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm
//                    text-white bg-blue-600 hover:bg-blue-700 focus:outline-none
//                    focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
//                    disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {isLoading ? "处理中..." : isRegistering ? "立即注册" : "立即登录"}
//         </button>

//         <div className="text-center text-sm text-gray-600">
//           {isRegistering ? "已有账号？" : "没有账号？"}
//           <button
//             type="button"
//             onClick={() => setIsRegistering(!isRegistering)}
//             className="text-blue-600 hover:text-blue-500 ml-1"
//             disabled={isLoading}
//           >
//             {isRegistering ? "去登录" : "立即注册"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Login;
