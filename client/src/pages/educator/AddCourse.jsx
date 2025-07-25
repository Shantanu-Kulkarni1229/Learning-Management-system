import React, { useEffect, useRef, useState } from 'react';
import uniqid from 'uniqid';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddCourse = () => {
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const [courseTitle, setCourseTitle] = useState('');
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [action, setAction] = useState('add');
  const [chapterId, setChapterId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: '',
    lectureDuration: '',
    lectureUrl: '',
    isPreviewFree: false,
  });

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered'}, { list: 'bullet' }],
            ['link', 'image'],
            ['clean']
          ]
      }});
    }
  }, []);

  const handleAddChapter = (action, chapterId = null) => {
    if (action === 'add') {
      const newChapter = {
        id: uniqid(),
        chapterTitle: `Chapter ${chapters.length + 1}`,
        chapterContent: [],
        collapsed: false,
        chapterOrder: chapters.length > 0 ? chapters[chapters.length - 1].chapterOrder + 1 : 1,
      };
      setChapters([...chapters, newChapter]);
    }
    else if (action === 'remove') {
      setChapters(chapters.filter((chapter) => chapter.id !== chapterId));
    } else if (action === 'toggle') {
      setChapters(
        chapters.map((chapter) => chapter.id === chapterId ? { ...chapter, collapsed: !chapter.collapsed } : chapter
        )
      );
    }
  };

  const handleAddLecture = () => {
    if (!lectureDetails.lectureTitle.trim()) {
      toast.error('Lecture title is required');
      return;
    }
    if (!lectureDetails.lectureDuration) {
      toast.error('Lecture duration is required');
      return;
    }
    if (!lectureDetails.lectureUrl.trim()) {
      toast.error('Lecture URL is required');
      return;
    }

    setChapters(prev =>
      prev.map(chapter =>
        chapter.id === currentChapterId
          ? {
              ...chapter,
              chapterContent: [...chapter.chapterContent, { 
                id: uniqid(),
                ...lectureDetails 
              }],
            }
          : chapter
      )
    );
    setLectureDetails({
      lectureTitle: '',
      lectureDuration: '',
      lectureUrl: '',
      isPreviewFree: false,
    });
    setShowPopup(false);
    toast.success('Lecture added successfully');
  };

  const handleRemoveLecture = (chapterId, lectureId) => {
    setChapters(prev =>
      prev.map(chapter =>
        chapter.id === chapterId
          ? {
              ...chapter,
              chapterContent: chapter.chapterContent.filter(lecture => lecture.id !== lectureId),
            }
          : chapter
      )
    );
    toast.info('Lecture removed');
  };

  const handleLectureDetailsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLectureDetails(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        toast.error('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      setImage(file);
      toast.success('Image selected');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (!courseTitle.trim()) {
        toast.error('Course title is required');
        setIsLoading(false);
        return;
      }

      const description = quillRef.current?.root.innerHTML || '';
      if (description.length < 50) {
        toast.error('Course description should be at least 50 characters');
        setIsLoading(false);
        return;
      }

      if (chapters.length === 0) {
        toast.error('Please add at least one chapter');
        setIsLoading(false);
        return;
      }

      // Validate that all chapters have at least one lecture
      const hasEmptyChapters = chapters.some(chapter => chapter.chapterContent.length === 0);
      if (hasEmptyChapters) {
        toast.error('All chapters must have at least one lecture');
        setIsLoading(false);
        return;
      }

      // Prepare form data
      const formData = new FormData();
      formData.append('title', courseTitle);
      formData.append('description', description);
      formData.append('price', coursePrice);
      formData.append('discount', discount);
      if (image) {
        formData.append('thumbnail', image);
      }
      formData.append('chapters', JSON.stringify(chapters));

      // API call - replace with your actual endpoint
      const response = await axios.post('https://your-api-endpoint.com/courses', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Add auth if needed
        },
      });

      if (response.data.success) {
        toast.success('Course saved successfully!');
        navigate(`/courses/${response.data.courseId}`);
      } else {
        toast.error(response.data.message || 'Failed to save course');
      }
    } catch (error) {
      console.error('Error saving course:', error);
      toast.error(error.response?.data?.message || 'An error occurred while saving the course');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='h-screen overflow-scroll flex flex-col items-start justify-between md:p-8 p-4 pt-8'>
      <form onSubmit={handleSubmit}>
        <div className='flex flex-col gap-1 mb-4'>
          <p>Course Title</p>
          <input
            type='text'
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            placeholder='Enter Course Title'
            className='outline-none py-2 px-3 rounded border border-gray-500'
            required
          />
        </div>

        <div className='flex flex-col gap-1 mb-4'>
          <p>Course Description</p>
          <div ref={editorRef} className='h-40 bg-white border border-gray-300 rounded'></div>
        </div>

        <div className='flex flex-col md:flex-row gap-6 mb-4'>
          <div>
            <p>Course Price</p>
            <input
              type='number'
              value={coursePrice}
              onChange={(e) => setCoursePrice(Number(e.target.value))}
              placeholder='Enter Course Price'
              className='outline-none py-2 px-3 rounded border border-gray-500'
              min="0"
            />
          </div>

          <div>
            <p>Discount %</p>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              placeholder="Enter Discount"
              className="outline-none py-2 px-3 rounded border border-gray-500"
              min="0"
              max="100"
            />
          </div>
        </div>

        <div className='mb-4'>
          <p>Course Thumbnail</p>
          <label htmlFor='thumbnailImage' className='cursor-pointer inline-block'>
            <img src={assets.file_upload_icon} alt='Upload Icon' className='w-10' />
            <input
              type='file'
              id='thumbnailImage'
              onChange={handleImageUpload}
              accept='image/*'
              hidden
            />
          </label>
          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt='Thumbnail Preview'
              className='w-32 mt-2 rounded'
            />
          )}
        </div>

        <div className='mt-6'>
          <h3 className='text-lg font-semibold mb-2'>Chapters</h3>
          {chapters.map((chapter, chapterIndex) => (
            <div key={chapter.id} className='border p-3 rounded mb-4'>
              <div className='flex justify-between items-center mb-2'>
                <div 
                  className='flex items-center gap-2 cursor-pointer'
                  onClick={() => handleAddChapter('toggle', chapter.id)}
                >
                  <img 
                    src={assets.dropdown_icon} 
                    width={14} 
                    alt='' 
                    className={`transition-transform ${chapter.collapsed ? 'rotate-90' : ''}`}
                  />
                  <span>
                    {chapterIndex + 1}. {chapter.chapterTitle}
                  </span>
                </div>
                <div className='flex items-center gap-3'>
                  <span>{chapter.chapterContent.length} Lectures</span>
                  <img
                    src={assets.cross_icon}
                    alt='Remove'
                    onClick={() => handleAddChapter('remove', chapter.id)}
                    className='w-4 h-4 cursor-pointer'
                  />
                </div>
              </div>

              {!chapter.collapsed && (
                <div className='space-y-2'>
                  {chapter.chapterContent.map((lecture) => (
                    <div
                      key={lecture.id}
                      className='flex items-center justify-between text-sm border-b pb-1'
                    >
                      <span>
                        {lecture.lectureTitle} - {lecture.lectureDuration} mins -{' '}
                        <a href={lecture.lectureUrl} target='_blank' rel='noreferrer' className='text-blue-600'>
                          Link
                        </a>{' '}
                        - {lecture.isPreviewFree ? 'Free' : 'Paid'}
                      </span>
                      <img
                        src={assets.cross_icon}
                        alt='Remove'
                        onClick={() => handleRemoveLecture(chapter.id, lecture.id)}
                        className='w-4 h-4 cursor-pointer'
                      />
                    </div>
                  ))}
                </div>
              )}

              <button
                type='button'
                onClick={() => {
                  setCurrentChapterId(chapter.id);
                  setShowPopup(true);
                }}
                className='text-blue-600 text-sm mt-2'
              >
                + Add Lecture
              </button>
            </div>
          ))}

          <button
            type='button'
            onClick={() => handleAddChapter('add')}
            className='mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
          >
            + Add Chapter
          </button>
        </div>

        <button 
          type="submit" 
          className="mt-6 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : 'Save Course'}
        </button>
      </form>

      {showPopup && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded shadow-md w-80 relative'>
            <img
              src={assets.cross_icon}
              alt='Close'
              className='absolute top-3 right-3 w-4 h-4 cursor-pointer'
              onClick={() => setShowPopup(false)}
            />
            <h1 className='text-lg font-bold mb-4'>Add Lecture</h1>
            <div className='mb-2'>
              <p>Lecture Title*</p>
              <input
                type='text'
                name="lectureTitle"
                value={lectureDetails.lectureTitle}
                onChange={handleLectureDetailsChange}
                className='w-full border px-2 py-1 rounded'
                required
              />
            </div>
            <div className='mb-2'>
              <p>Duration (Minutes)*</p>
              <input
                type='number'
                name="lectureDuration"
                value={lectureDetails.lectureDuration}
                onChange={handleLectureDetailsChange}
                className='w-full border px-2 py-1 rounded'
                min="1"
                required
              />
            </div>
            <div className='mb-2'>
              <p>Lecture URL*</p>
              <input
                type='url'
                name="lectureUrl"
                value={lectureDetails.lectureUrl}
                onChange={handleLectureDetailsChange}
                className='w-full border px-2 py-1 rounded'
                required
              />
            </div>
            <div className='mb-2'>
              <label className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  name="isPreviewFree"
                  checked={lectureDetails.isPreviewFree}
                  onChange={handleLectureDetailsChange}
                />
                Is Preview Free?
              </label>
            </div>
            <button
              type='button'
              onClick={handleAddLecture}
              className='mt-2 w-full bg-blue-600 text-white py-1.5 rounded hover:bg-blue-700'
            >
              Add Lecture
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCourse;