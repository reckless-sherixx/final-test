import React, { useState } from 'react'
import { useDeleteUserMutation, useGetUserProfileQuery } from '../../../redux/features/auth/authapi'
import { MdEdit } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import UpdateUserModel from './UpdateUserModel';

const ManageUsers = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModelOpen, setIsModelOpen] = useState();
  const {data, error, isLoading, refetch} = useGetUserProfileQuery();
  const [deleteUser] = useDeleteUserMutation();
  const navigate = useNavigate();
  // console.log(data?.users)
  const handleDelete =  async (id) => {
    try {
      const response = await deleteUser(id).unwrap();
      console.log(response);
      alert("User deleted successfully.");
      refetch();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModelOpen(true);
  };

  const handleCloseModel = () => {
    setIsModelOpen(false);
    setSelectedUser(null);
  };

  return (
    <>
    {
      isLoading && <p>Loading...</p>
    }
    <section className="py-1 bg-blueGray-50">
<div className="w-full  mb-12 xl:mb-0 px-4 mx-auto">
  <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded ">
    <div className="rounded-t mb-0 px-4 py-3 border-0">
      <div className="flex flex-wrap items-center">
        <div className="relative w-full px-4 max-w-full flex-grow flex-1">
          <h3 className="font-semibold text-base text-blueGray-700">All Users</h3>
        </div>
        <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
          <button className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">See all</button>
        </div>
      </div>
    </div>

    <div className="block w-full overflow-x-auto">
      <table className="items-center bg-transparent w-full border-collapse ">
        <thead>
          <tr>
            <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                           Sl No.
                        </th>
          <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                          User Email
                        </th>
           <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                          User Role
                        </th>
          <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                          Edit or Manage
                        </th>
          <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                          Delete
                        </th>
          </tr>
        </thead>

        <tbody>
          {
            data?.users && data.users.map((user, index) => (          <tr key={index}>
              <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700 ">
                {index + 1}
              </th>
              <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ">
                {user?.email}
              </td>
              <td className="border-t-0 px-6 align-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                {user?.role}
              </td>
              <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                <button onClick={() => handleEdit(user)} className='hover:text-blue-700'>
                <span className='flex gap-1 items-center justify-center'>
                <MdEdit/> Edit
                </span>
                </button>
              </td>
              <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                <button className='bg-red-500 text-white active:bg-red-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none' onClick={() => {
                  if (window.confirm('Are you sure you want to delete this User?')) {
                    handleDelete(user._id);
                  }
                }}>Delete</button>
              </td>
            </tr>))
          }


        </tbody>

      </table>
    </div>
  </div>
</div>
</section>
    {
      isModelOpen && <UpdateUserModel user={selectedUser} onClose={handleCloseModel} onRoleUpdate = {refetch}/>
    }
    </>
  )
}

export default ManageUsers