import { useEffect, useState } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import { withRouter } from 'next/router';
import { getCookie, isAuth } from '../../actions/auth';
import { getCategories } from '../../actions/category';
import { getTags } from '../../actions/tag';
import { singleBlog, updateBlog } from '../../actions/blog';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import '../../node_modules/react-quill/dist/quill.snow.css'
import { QuillFormats, QuillModules } from '../../helpers/quill';
import { DOMAIN } from '../../config';


const BlogUpdate = ({ router }) => {
    const [body, setBody] = useState('');
    const [values, setValues] = useState({
        error: "",
        success: "",
        formData: "",
        title: "",
    })
    const { error, success, formData, title } = values;
    const token = getCookie('token');

    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);

    const [checkedCat, setCheckedCat] = useState([]);
    const [checkedTag, setCheckedTag] = useState([]);

    const initBlog = () => {
        if (router.query.slug) {
            singleBlog(router.query.slug).then(data => {
                if (data.error)
                    return console.log(data.error);
                else {
                    setValues({ ...values, title: data.title });
                    setBody(data.body);
                    setCategoriesArray(data.categories);
                    setTagsArray(data.tags);
                }
            })
        }
    }


    const setCategoriesArray = blogCategories => {
        let ca = []
        blogCategories.map((c, i) => {
            ca.push(c._id);
        })
        setCheckedCat(ca);
    }

    const setTagsArray = blogTags => {
        let ta = [];
        blogTags.map((t, i) => {
            ta.push(t._id);
        })
        setCheckedTag(ta);
    }

    useEffect(() => {
        setValues({ ...values, formData: new FormData() })
        initBlog();
        initCategories();
        initTags();
    }, [router]);


    const handleChange = name => e => {
        const value = name === 'photo' ? e.target.files[0] : e.target.value;
        formData.set(name, value);
        setValues({ ...values, [name]: value, formData, error: "" })
    }

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

    const handleBody = e => {
        // setBody(e);
        // formData.set('body', e);
    }

    const editBlog = e => {
        e.preventDefault();
        updateBlog(formData, token, router.query.slug).then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setValues({ ...values, title: "", success: 'Blog successfully updated' });
                if (isAuth() && isAuth().role === 1) {
                    Router.replace(`${DOMAIN}/admin/crud/${router.query.slug}`);
                } else if (isAuth() && isAuth().role === 0) {
                    Router.replace(`${DOMAIN}/user/crud/${router.query.slug}`);
                }
            }

        })
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

    const updateBlogForm = () => {
        return (
            <form onSubmit={editBlog}>
                <div className="form-group">
                    <label className="text-muted">Title</label>
                    <input type="text" value={title} name="title" onChange={handleChange('title')} className="form-control" />
                </div>
                <div className="form-group">
                    <label className="text-muted">Title</label>
                    <ReactQuill modules={QuillModules} formats={QuillFormats} value={body} placeholder="Write something amazing..." onChange={handleBody} />
                </div>
                <button className="btn btn-primary mt-3">Update</button>
            </form>
        )
    }


    const findCategory = c => {
        const result = checkedCat.indexOf(c);
        if (result !== -1) {
            return true;
        } else {
            return false;
        }
    }

    const findTags = t => {
        const result = checkedTag.indexOf(t);
        if (result !== -1) {
            return true;
        } else {
            return false;
        }
    }

    const showCategories = () => {
        return (
            categories && categories.map((c, i) => (
                <li className="list-unstyled" key={i}>
                    <input onChange={handleCatToggle(c._id)} checked={findCategory(c._id)} type="checkbox" id={c.slug} className="m-2" />
                    <label htmlFor={c.slug} className="form-check-label">{c.name}</label>
                </li>
            ))
        )
    }

    const showTags = () => {
        return (
            tags && tags.map((t, i) => (
                <li className="list-unstyled" key={i}>
                    <input onChange={handleTagToggle(t._id)} checked={findTags(t._id)} type="checkbox" id={t.slug} className="m-2" />
                    <label htmlFor={t.slug} className="form-check-label">{t.name}</label>
                </li>
            ))
        )
    }


    return <div className="container-fluid">
        <div className="row mb-5">
            <div className="col-md-8">
                {showError()}
                {showSuccess()}
                {updateBlogForm()}
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



export default withRouter(BlogUpdate);