import React, {useState, useEffect} from 'react';

import Builder from "../Builder/Builder";
import RequestSpinner from "../RequestSpinner/RequestSpinner";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import styles from './Dashboard.module.scss';

const Dashboard = ({auth}) => {

    const [isDrawer, setDrawer] = useState(false);
    const [isLoaded, setLoaded] = useState(false);
    const [templates, setTemplates] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [isEditor, setEditor] = useState(false);
    const [resume, setResume] = useState(null);
    // this may mount the builder component


    useEffect(() => {
        loadData().then(() => {
            setLoaded(true);
        }).catch(err => {
            console.error(err)
        });
    }, []);

    useEffect(() => {
        setLoaded(false);
        loadData().then(() => {
            setLoaded(true);
        }).catch(err => {
            console.error(err)
        });
    }, [isEditor])


    async function loadData() {

        let templateArray = [];
        for (let i = 0; i < 4; i++) {
            fetch('./backend/api/api.php/get_template', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + auth?.access_token
                },
                body: JSON.stringify({
                    'id': auth?.id,
                    'n': 1
                })
            }).then((result) => result.json())
                .then((resultJson) => {
                    let id = resultJson.id;
                    let resume_id = resultJson.resume_id;
                    // let image = new Image();
                    // image.src = 'data:image/png;base64,'+resultJson.thumbnail;
                    // templateArray.push({'title': resume_id, 'thumbnail': image});
                    templateArray.push({'id': resume_id, 'thumbnail': 'data:image/png;base64,' + resultJson.thumbnail});
                    setTemplates(templateArray);
                });
        }

        const numResumes = await fetch('./backend/api/api.php/get_dashboard_count', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + auth?.access_token
            },
            body: JSON.stringify({
                'id': auth?.id
            })
        });

        const countJSON = await numResumes.json();

        let resumeArray = [];
        for (let i = 0; i < countJSON.count; i++) {
            await fetch('./backend/api/api.php/get_dashboard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + auth?.access_token
                },
                body: JSON.stringify({
                    'id': auth?.id,
                    'n': i
                })
            })
                .then((result) => result.json())
                .then((resultJson) => {
                    let id = resultJson.id;
                    let resume_id = resultJson.resume_id;
                    // let image = new Image();
                    // image.src = 'data:image/png;base64,'+resultJson.thumbnail;
                    // resumeArray.push({'title': resume_id, 'thumbnail':image});
                    resumeArray.push({'id': resume_id, 'thumbnail': 'data:image/png;base64,' + resultJson.thumbnail});
                    setDocuments(resumeArray);
                    setLoaded(true);
                })
        }



    }

    return (
        <div className={styles['page-root']}>
            {isEditor ? <Builder auth={auth} resume={resume} setEditor={setEditor} setResume={setResume}/>
                : isLoaded ?
                    <>
                        <section className={styles['workspace']}>
                            <div className={styles['documents-space']}>
                                <NewDocument setEditor={setEditor} setResume={setResume}/>
                                {documents.map((el) => <Document setEditor={setEditor} setResume={setResume}
                                                                resumeID={el.id + '-doc'} image={el.thumbnail}/>)}
                            </div>
                        </section>
                        <section className={isDrawer ? `${styles.templates} ${styles.active}` : styles['templates']}>
                            <div className={`${styles['templates-options']}`}>
                                {templates.map(el => <Template setEditor={setEditor} setResume={setResume}
                                                               resumeID={el.id + '-template'} isDrawer={isDrawer}
                                                               image={el.thumbnail}/>)}
                            </div>
                            <span className={`${styles['templates-fade']}`}/>
                            <div className={`${styles['templates-btn-div']}`}>
                                <div className={`${styles['templates-btn-wrap']}`}>
                                    {isDrawer ? <FontAwesomeIcon icon="fa-solid fa-angle-left"/> : null}
                                    <button className={`${styles['templates-btn']}`} onClick={() => {
                                        setDrawer(!isDrawer)
                                    }}>
                                        {isDrawer ? ('Collapse the templates view') : 'Look around more templates'}
                                    </button>
                                    {isDrawer ? null : <FontAwesomeIcon icon="fa-solid fa-angle-right"/>}
                                </div>
                            </div>
                        </section>
                    </>
                    :
                    <RequestSpinner/>
            }
        </div>
    )
}

const NewDocument = ({setEditor, setResume}) => {
    return (
        <div
            onClick={() => {
                //I chose an arbitrarily high number to ensure that it isn't created already.
                //The result is that the api sees no 999999-doc and inserts at len(resumes)+1.
                setResume('999999-doc');
                setEditor(true);
            }} className={`${styles['new-doc']}`}>
            <FontAwesomeIcon icon="fa-solid fa-plus"/>
        </div>
    )
}

const Document = ({setEditor, setResume, resumeID, image}) => {


    return (
        <div
            onClick={() => {
                setResume(resumeID);
                setEditor(true);
            }}
            className={`${styles['single-doc']}`}>
            <img className={`${styles.images}`} src={image}/>
        </div>
    )
}

const Template = ({setEditor, setResume, isDrawer, resumeID, image}) => {

    return (
        <div
            onClick={() => {
                setResume(resumeID);
                setEditor(true);
            }}
            className={isDrawer ? `${styles['single-template']} ${styles.active}` : `${styles['single-template']}`}>
            <img className={`${styles.images}`} src={image}/>
        </div>
    )
}

export default Dashboard;
