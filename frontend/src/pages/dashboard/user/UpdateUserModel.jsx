import React, { useState } from 'react'
import { useUpdateUserRoleMutation } from '../../../redux/features/auth/authapi';

const UpdateUserModel = ({user, onClose, onRoleUpdate}) => {
    const [role, setRole] = useState(user?.role);
    const [name, setName] = useState(user?.name || '');
    const [surname, setSurname] = useState(user?.surname || '');
    const [grade, setGrade] = useState(user?.grade || '');
    const [updateUserRole] = useUpdateUserRoleMutation();

    const handleUpdateUser = async () => {
        try {
            await updateUserRole({
                userId: user.id,
                role: role,
                name: name,
                surname: surname,
                grade: grade,
                username: `${name}${surname}${grade}` // Generate new username based on updated fields
            }).unwrap();
            
            alert("User updated successfully");
            onRoleUpdate();
            onClose();
        } catch (error) {
            console.error("Failed to update user:", error);
            alert("Failed to update user. Please try again.");
        }
    };

    return (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
            <div className='bg-white p-4 rounded shadow-lg w-1/3'>
                <h2 className='text-xl mb-4'>Update User</h2>
                
                <div className='mb-4 space-y-4'>
                    <label className='block text-gray-700 text-sm mb-2' htmlFor='name'>Name:</label>
                    <input 
                        className='block w-full px-3 py-2 text-gray-700 border border-gray-300 rounded' 
                        type='text' 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className='mb-4 space-y-4'>
                    <label className='block text-gray-700 text-sm mb-2' htmlFor='surname'>Surname:</label>
                    <input 
                        className='block w-full px-3 py-2 text-gray-700 border border-gray-300 rounded' 
                        type='text' 
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                    />
                </div>

                <div className='mb-4 space-y-4'>
                    <label className='block text-gray-700 text-sm mb-2' htmlFor='grade'>Grade:</label>
                    <input 
                        className='block w-full px-3 py-2 text-gray-700 border border-gray-300 rounded' 
                        type='text' 
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                    />
                </div>

                <div className='mb-4 space-y-4'>
                    <label className='block text-gray-700 text-sm mb-2' htmlFor='username'>Username:</label>
                    <input 
                        className='block w-full px-3 py-2 text-gray-700 border border-gray-300 rounded' 
                        type='text' 
                        value={user?.username} 
                        readOnly 
                    />
                </div>

                <div className='mb-4 space-y-4'>
                    <label className='block text-gray-700 text-sm mb-2' htmlFor='role'>Role:</label>
                    <select 
                        className='block w-full px-3 py-2 text-gray-700 border border-gray-300 rounded' 
                        value={role} 
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value='student'>Student</option>
                        <option value='admin'>Admin</option>
                        <option value='moderator'>Moderator</option>
                        <option value='creator'>Creator</option>
                    </select>
                </div>

                <div className='flex justify-end space-x-4'>
                    <button 
                        className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600' 
                        onClick={handleUpdateUser}
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
    )
}

export default UpdateUserModel