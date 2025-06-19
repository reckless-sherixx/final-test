import React, { useRef, useState } from "react";
import { useUpdateUserRoleMutation } from "../../../redux/features/auth/authapi";
import { useNavigate } from "react-router-dom";

const UpdateUserModel = ({
  user,
  currentLoggedUser,
  onClose,
  onRoleUpdate,
}) => {
   const navigate = useNavigate();
  const [role, setRole] = useState(user?.role);
  const [name, setName] = useState(user?.name || "");
  const [surname, setSurname] = useState(user?.surname || "");
  const [grade, setGrade] = useState(user?.grade || "");
  const [updateUserRole] = useUpdateUserRoleMutation();

  const handleResetPassword = () => {
    navigate(`/admin/reset-password/${user.id}`, { 
      state: { 
        userId: user.id,
        username: user.username 
      } 
    });
  };

  const canEditUser = () => {
    if (currentLoggedUser.role === "admin") {
      return true;
    }
    if (currentLoggedUser.role === "moderator") {
      return user.role === "creator" || user.role === "student"; // Moderator can only edit creators and students
    }
    return false;
  };

  const resetPasswordLink = `${
    import.meta.env.VITE_FRONTEND_URL
  }/reset-password`;

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(resetPasswordLink)
      .then(() => {
        alert("Reset link copied to clipboard!");
      })
      .catch(() => {
        alert("Failed to copy link");
      });
  };

  const handleUpdateUser = async () => {
    if (!canEditUser()) {
      alert("You don't have permission to edit this user.");
      return;
    }
    try {
      let updateData = {
        userId: user.id,
        role: role,
      };
      const nameChanged = name !== user.name;
      const surnameChanged = surname !== user.surname;
      const gradeChanged = grade !== user.grade;
      const roleChanged = role !== user.role;

      if (nameChanged || surnameChanged) {
        if (!name.trim() || !surname.trim()) {
          alert("Both name and surname must be provided together");
          return;
        }
        updateData.name = name.trim();
        updateData.surname = surname.trim();
        updateData.username = `${name}${surname}${grade}`;
      }
      if (gradeChanged) {
        if (!grade.trim()) {
          alert("Grade cannot be empty");
          return;
        }
        updateData.grade = grade.trim();
        if (nameChanged || surnameChanged) {
          updateData.username = `${name}${surname}${grade}`;
        } else {
          updateData.username = `${user.name}${user.surname}${grade}`;
        }
      }
      if (roleChanged && !nameChanged && !surnameChanged && !gradeChanged) {
        updateData = {
          userId: user.id,
          role: role,
        };
      }

      await updateUserRole(updateData).unwrap();
      alert("User updated successfully");
      onRoleUpdate();
      onClose();
    } catch (error) {
      console.error("Failed to update user:", error);
      alert("Failed to update user. Please try again.");
    }
  };

  const getRoleOptions = () => {
    if (currentLoggedUser.role === "admin") {
      return (
        <>
          <option value="student">Student</option>
          <option value="creator">Creator</option>
          <option value="moderator">Moderator</option>
          <option value="admin">Admin</option>
        </>
      );
    }
    if (currentLoggedUser.role === "moderator") {
      return (
        <>
          <option value="student">Student</option>
          <option value="creator">Creator</option>
        </>
      );
    }
    return null;
  };
  const isFormDisabled = !canEditUser();

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
        <div className='bg-white p-4 rounded shadow-lg w-1/3'>
            <h2 className='text-xl mb-4'>Update User</h2>
            
            {!canEditUser() && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    You don't have permission to edit this user.
                </div>
            )}
            
            <div className='mb-4 space-y-4'>
                <label className='block text-gray-700 text-sm mb-2' htmlFor='name'>Name:</label>
                <input 
                    className='block w-full px-3 py-2 text-gray-700 border border-gray-300 rounded' 
                    type='text' 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isFormDisabled}
                />
            </div>
            <div className='mb-4 space-y-4'>
                <label className='block text-gray-700 text-sm mb-2' htmlFor='name'>Surname:</label>
                <input 
                    className='block w-full px-3 py-2 text-gray-700 border border-gray-300 rounded' 
                    type='text' 
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    disabled={isFormDisabled}
                />
            </div>
            <div className='mb-4 space-y-4'>
                <label className='block text-gray-700 text-sm mb-2' htmlFor='name'>Grade:</label>
                <input 
                    className='block w-full px-3 py-2 text-gray-700 border border-gray-300 rounded' 
                    type='text' 
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    disabled={isFormDisabled}
                />
            </div>


            <div className='mb-4 space-y-4'>
                <label className='block text-gray-700 text-sm mb-2' htmlFor='role'>Role:</label>
                <select 
                    className='block w-full px-3 py-2 text-gray-700 border border-gray-300 rounded' 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)}
                    disabled={isFormDisabled}
                >
                    {getRoleOptions()}
                </select>
            </div>

            <div className='mb-4 space-y-4'>
                    <label className='block text-gray-700 text-sm mb-2' htmlFor='reset-link'>
                        Reset Password Link:
                    </label>
                    <div className='flex items-center space-x-2'>
                        <input 
                            className='block w-full px-3 py-2 text-gray-700 border border-gray-300 rounded' 
                            type='text' 
                            value={resetPasswordLink}
                            readOnly 
                        />
                        <button 
                            onClick={handleCopyLink}
                            className='px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 whitespace-nowrap'
                            title='Copy to clipboard'
                        >
                            Copy Link
                        </button>
                    </div>
                </div>

                
             {currentLoggedUser.role === "admin" && (
                <div className='mb-4 space-y-4'>
                    <label className='block text-gray-700 text-sm mb-2'>
                        Reset Password:
                    </label>
                    <button 
                        onClick={handleResetPassword}
                        className='px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded'
                    >
                        Reset User Password
                    </button>
                    <p className="text-xs text-gray-500 mt-1">
                        Only administrators can reset user passwords
                    </p>
                </div>
            )}

            <div className='flex justify-between space-x-4 pt-5'>
                <button 
                    className={`px-4 py-2 rounded ${
                        isFormDisabled 
                            ? 'bg-gray-300 cursor-not-allowed' 
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                    onClick={handleUpdateUser}
                    disabled={isFormDisabled}
                >
                    Update
                </button>
                <button 
                    className='px-4 py-2 text-gray-700 rounded hover:text-gray-800' 
                    onClick={onClose}
                >
                    Cancel
                </button>
            </div>
        </div>
    </div>
);
};

export default UpdateUserModel;
