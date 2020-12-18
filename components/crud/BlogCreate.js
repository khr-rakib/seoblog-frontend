import { useEffect, useState } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import { withRouter } from 'next/router';
import { getCookie, isAuth } from '../../actions/auth';
import { getCategories } from '../../actions/category';
import { getTags } from '../../actions/tag';
import { createBlog } from '../../actions/blog';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import '../../node_modules/react-quill/dist/quill.snow.css'
import { QuillFormats, QuillModules } from '../../helpers/quill';


const CreateBlog = ({ router }) => {
    const blogFromLS = () => {
        if (typeof window === 'undefined') {
            return false;
        }
        if (localStorage.getItem('blog')) {
            return JSON.parse(localStorage.getItem('blog'));
        } else {
            return false;
        }
    }


    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);

    const [checkedCat, setCheckedCat] = useState([]);
    const [checkedTag, setCheckedTag] = useState([]);


    const [body, setBody] = useState(blogFromLS());
    const [values, setValues] = useState({
        error: "",
        sizeError: "",
        success: "",
        formData: "",
        title: "",
        hidePublishButton: false,

    })

    const { error, sizeError, success, formData, title, hidePublishButton } = values;
    const token = getCookie('token');

    useEffect(() => {
        setValues({ ...values, formData: new FormData() });
        initCategories();
        initTags();
    }, [router]);

    const initCategories = () => {
        getCategories().then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setCategories(data)
            }
        })
    }

    const initTags = () => {
        getTags().then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setTags(data)
            }
        })
    }

    const publishBlog = e => {
        e.preventDefault();
        createBlog(formData, token).then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error })
            } else {
                setValues({ ...values, title: "", error: '', success: "A  new Blog is created!" });
                setBody('');
                setCategories([]);
                setTags([]);
            }
        })
    }

    const handleChange = name => e => {
        const value = name === 'photo' ? e.target.files[0] : e.target.value;
        formData.set(name, value);
        setValues({ ...values, [name]: value, formData, error: "" })
    }

    const handleBody = e => {
        setBody(e);
        formData.set('body', e)
        if (typeof window !== 'undefined') {
            localStorage.setItem('blog', JSON.stringify(e));
        }
    }


    const handleCatToggle = id => () => {
        setValues({ ...values, error: "" });
        // return the first index or -1
        const clickedCategory = checkedCat.indexOf(id)
        const all = [...checkedCat];
        if (clickedCategory === -1) {
            all.push(id);
        } else {
            all.splice(clickedCategory, 1)
        }
        setCheckedCat(all)
        formData.set('categories', all);
    }
    const handleTagToggle = id => () => {
        setValues({ ...values, error: "" });
        // return the first index or -1
        const clickedTag = checkedTag.indexOf(id)
        const all = [...checkedTag];
        if (clickedTag === -1) {
            all.push(id);
        } else {
            all.splice(clickedTag, 1)
        }
        setCheckedTag(all)
        formData.set('tags', all);
    }

    const showCategories = () => {
        return (
            categories && categories.map((c, i) => (
                <li className="list-unstyled" key={i}>
                    <input onChange={handleCatToggle(c._id)} type="checkbox" id={c.slug} className="m-2" />
                    <label htmlFor={c.slug} className="form-check-label">{c.name}</label>
                </li>
            ))
        )
    }

    const showTags = () => {
        return (
            tags && tags.map((t, i) => (
                <li className="list-unstyled" key={i}>
                    <input onChange={handleTagToggle(t._id)} type="checkbox" id={t.slug} className="m-2" />
                    <label htmlFor={t.slug} className="form-check-label">{t.name}</label>
                </li>
            ))
        )
    }


    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    )
    const showSuccess = () => (
        <div className="alert alert-success" style={{ display: success ? '' : 'none' }}>
            {success}
        </div>
    )

    const createBlogForm = () => {
        return (
            <form onSubmit={publishBlog}>
                <div className="form-group">
                    <label className="text-muted">Title</label>
                    <input type="text" value={title} name="title" onChange={handleChange('title')} className="form-control" />
                </div>
                <div className="form-group">
                    <label className="text-muted">Title</label>
                    <ReactQuill modules={QuillModules} formats={QuillFormats} value={body} placeholder="Write something amazing..." onChange={handleBody} />
                </div>
                <button className="btn btn-primary mt-3">Published</button>
            </form>
        )
    }

    return <div className="container-fluid">
        <div className="row mb-5">
            <div className="col-md-8">
                {createBlogForm()}
                {showError()}
                {showSuccess()}
            </div>
            <div className="col-md-4">
                <div className="form-group pb-3">
                    <h5>Featured Image</h5>
                    <hr />
                    <small className="text-muted">Max size: 1mb</small>
                    <label className="btn btn-outline-info">
                        <span className="d-block">Upload Featured Image </span>
                        <input type="file" accept="image/*" onChange={handleChange('photo')} hidden />
                    </label>
                </div>
                <div>
                    <h5>Categories</h5>
                    <hr />
                    <ul style={{ maxHeight: "200px", overflowY: "scroll" }}>
                        {showCategories()}
                    </ul>
                </div>
                <div>
                    <h5>Tags</h5>
                    <hr />
                    <ul style={{ maxHeight: "200px", overflowY: "scroll" }}>
                        {showTags()}
                    </ul>
                </div>
            </div>
        </div>
    </div>
}



export default withRouter(CreateBlog);