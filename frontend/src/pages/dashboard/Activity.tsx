import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, Link } from "react-router-dom"
import { useNavigate } from 'react-router-dom'
import { FaPen, FaTrash } from "react-icons/fa";
import { useFormik, FormikValues } from "formik"
import * as yup from "yup"

import AddButton from '@/components/AddButton/AddButton';
import Editor from "@/components/Editor"
import Modal from '@/components/Modal';

import { clearUserData } from "@/common"
import { logout as clearUserDataFromRedux } from '@/redux/features/auth/authSlice';
import { routes, apiRoutes, createActivityRoute } from "@/router"
import { backendUrl } from "@/constants"
import * as u from "@/utils" 

import { Activity } from "@/types"

const inputProps = (form:FormikValues, fieldName:string) => {
  return {
    value: form.values[fieldName],
    onChange: form.handleChange,
    onBlur: form.handleBlur,
  }
}

const Error = (
  { form, fieldName } : 
  { form:FormikValues, fieldName:string },
) => {
  if (form.touched[fieldName] && form.errors[fieldName]) {
    return (
      <p className="mt-8 text-14 text-red-400">{form.errors[fieldName]}</p>
    )
  }

  return null
}

const ActivityPage = () => {
  const { slug } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth);

  const titleRef = useRef<HTMLInputElement>(null)

  const [activities, setActivities] = useState<Activity[]>([])
  const [editingActivity, setEditingActivity] = useState<Activity|null>(null)
  const [loading, setLoading] = useState(true)
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false)

  const addActivityToList = (activity:Activity) => {
    setActivities([ ...activities, activity ])
  }

  const form = useFormik({
    initialValues: {
      title: '',
      content: '',
      coverImageUrl: '',
      description: '',
    },
    validationSchema: yup.object().shape({
      title: yup.string().max(50).required("Title is required"),
      content: yup.string().required("Content is required"),
      coverImageUrl: yup.string().required("Cover image is required"),
      description: yup.string().required("Description is required"),
    }),
    onSubmit: async (values) => {
      try {
        showLoader()

        const response = await fetch(apiRoutes.createActivity, {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({
            type: slug,
            title: form.values.title,
            coverImageUrl: form.values.coverImageUrl,
            content: form.values.content,
            description: form.values.description,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          if (response.status === 401) {
            localLogout()
          }

          return 
        }

        const jsonResponse = await response.json()

        addActivityToList(jsonResponse)
        closeCreateModal();
      } catch (error) {
        console.log("Failed to submit Post", error);
      } finally {
        hideLoader()
      }
    },
  });

  const showLoader = () => setIsLoading(true)
  const hideLoader = () => setIsLoading(false)

  const openCreateModal = () => setCreateModalOpen(true);
  const closeCreateModal = () => setCreateModalOpen(false);

  const logout = () => {
    clearUserData()
    dispatch(clearUserDataFromRedux());
  }

  const removeActivityFromList = (activity:Activity) => {
    setActivities(activities.filter(a => a.id !== activity.id))
  }

  const editActivity = (activity:Activity) => {
    setEditingActivity(activity)
  }

  const closeEditModal = () => {
    setEditingActivity(null)
  }

  const localLogout = () => {
    clearUserData()
    clearUserDataFromRedux()
    navigate(routes.login)
  }

  const deleteActivity = async (activity:Activity) => {
    if (confirm("Are you sure you want to delete this post?")) {
      const response = await fetch(apiRoutes.deleteActivity(activity), {
        method: "DELETE",
        credentials: "include",
      })

      if (!response.ok) {
        if (response.status === 401) {
          logout()
        }

        return
      }

      removeActivityFromList(activity)
    }
  }

  const fetchData = async () => {
    const url = `${backendUrl}/activities/${slug}`
    const response = await fetch(url, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        localLogout()
      }

      return
    }

    const activities = await response.json()

    setActivities(activities)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="mt-32 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-32">
      {activities.map(activity => (
        <div className="relative" key={activity.id}>
          <div className="absolute top-12 right-12 flex">
            <button
              type="button"
              className="group size-36 flex items-center justify-center border-2 border-black hover:bg-black rounded-full transition duration-150"
              onClick={() => editActivity(activity)}
            >
              <FaPen className="group-hover:text-white text-black transition duration-150" />
            </button>
            <button
              type="button"
              className="group ml-8 size-36 flex items-center justify-center border-2 border-black hover:bg-black rounded-full transition duration-150"
              onClick={() => deleteActivity(activity)}
            >
              <FaTrash className="group-hover:text-white text-black transition duration-150" />
            </button>
          </div>
          <Link to={createActivityRoute(activity)}>
            <div>
              <img
                src={activity.coverImageUrl}
                className="h-288 w-full object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
              />
              <div className="p-20 bg-white">
                <h2 className="text-lg font-semibold text-gray-800 group-hover:text-[#1E73BE] transition-colors duration-300">
                  {activity.title}
                </h2>
                <p className="text-sm text-gray-500 mt-8">
                  {u.trimWithEllipsis(activity.description)}
                </p>
              </div>
            </div>
          </Link>
        </div>
      ))}
      <AddButton onClick={openCreateModal} />
      <Modal isOpen={createModalOpen} onClose={closeCreateModal}>
        <h2 className="text-24 font-semibold">Create a new Post</h2>
        <div className="bg-white md:p-32 p-8">
          <form onSubmit={form.handleSubmit} className="space-y-20 pt-24">
            <div>
              <label className="font-semibold text-20">Post Title:</label>
              <input
                type="text"
                ref={titleRef}
                placeholder="Ex: Importance of STEM Education..."
                className="mt-32 w-full inline-block bg-gray-50 focus:outline-none px-20 py-12"
                name="title"
                {...inputProps(form, "title")}
                autoFocus
              ></input>
              <Error form={form} fieldName="title" />
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start gap-16">
              <div className="md:w-2/3 w-full">
                <p className="font-semibold text-20 mb-20 text-zinc-800">Content Section</p>
                <Editor
                  content={form.values.content}
                  setContent={(content) => form.setFieldValue("content", content)}
                />
                <Error form={form} fieldName="content" />
              </div>
              <div
                className="md:w-1/3 w-full border p-20 space-y-20"
                style={{ maxHeight: "400px", overflowY: "scroll" }}
              >
                <p className="text-20 font-semibold">Choose Post Format</p>
                {/* For images */}
                <div className="space-y-16">
                  <label className="font-semibold">Post Cover:</label>
                  <input
                    type="text"
                    placeholder="https://unsplash.com/cover-image-of-post.png..."
                    className="w-full inline-block bg-gray-50 focus:outline-none px-20 py-12"
                    name="coverImageUrl"
                    {...inputProps(form, "coverImageUrl")}
                  ></input>
                  <Error form={form} fieldName="coverImageUrl" />
                </div>

                {/* Meta Description */}
                <div className="space-y-16">
                  <label className="font-semibold">Meta Description:</label>
                  <textarea
                    cols={4}
                    rows={4}
                    placeholder="Write your Post meta description"
                    className="w-full inline-block bg-gray-50 focus:outline-none px-20 py-12"
                    name="description"
                    {...inputProps(form, "description")}
                  ></textarea>
                  <Error form={form} fieldName="description" />
                </div>

                {/* Author */}
                <div className="space-y-16">
                  <label className="font-semibold">Author:</label>
                  <input
                    type="text"
                    className="w-full inline-block bg-gray-50 focus:outline-none px-20 py-12"
                    value={user.username}
                    placeholder={`Name of the Author`}
                    readOnly
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-20 bg-gray-900 hover:bg-indigo-500 text-white font-medium py-12 rounded-md"
            >
              Post Your Content
            </button>
          </form>
        </div>
      </Modal>
    </div>
  )
}

export default ActivityPage