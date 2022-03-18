import React, {useState, useEffect} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import styles from './Dashboard.module.scss';

// const sampleData = [
//     {title: 'sample0', thumbnail: 'none'},
//     {title: 'sample1', thumbnail: 'none'},
//
// ]
//
// const sampleTemplates = [
//     {title: 'template1', thumbnail: 'none'},
//     {title: 'template2', thumbnail: 'none'},
//     {title: 'template3', thumbnail: 'none'},
//     {title: 'template4', thumbnail: 'none'},
//     {title: 'template5', thumbnail: 'none'},
//     {title: 'template6', thumbnail: 'none'},
//     {title: 'template7', thumbnail: 'none'},
//     {title: 'template8', thumbnail: 'none'},
// ]

const Dashboard = ({auth}) => {

    const [isDrawer, setDrawer] = useState(false);
    const [isLoaded, setLoaded] = useState(false);
    const [templates, setTemplates] = useState([]);
    const [documents, setDocuments] = useState([]);
    // this may mount the builder component

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {

        let templateArray = [];
        for(var i = 0; i < 4; i++){
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
                    templateArray.push({'title': resume_id, 'thumbnail': 'data:image/png;base64,'+resultJson.thumbnail});
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
        for(var i=0; i < countJSON.count; i++){
            fetch('./backend/api/api.php/get_dashboard',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + auth?.access_token
                },
                body: JSON.stringify({
                    'id': auth?.id,
                    'n': i
                })
            }).then((result) => result.json())
            .then((resultJson) => {
                let id = resultJson.id;
                let resume_id = resultJson.resume_id;
                // let image = new Image();
                // image.src = 'data:image/png;base64,'+resultJson.thumbnail;
                // resumeArray.push({'title': resume_id, 'thumbnail':image});
                resumeArray.push({'title': resume_id, 'thumbnail': 'data:image/png;base64,'+resultJson.thumbnail});
                setDocuments(resumeArray);
            });
        }
        
        setLoaded(true);


        // fetch('url').then((response) => {
        //     setTemplates([])
        //     setDocuments([])
        // }).then((response) => {
        //         setLoaded(true);
        //     }
        // ).catch((err) => {
        //     console.error(err)
        //     setLoaded(false);
        // })
    }

    return (
        <div className={styles['page-root']}>
            <section className={styles['workspace']}>
                <div className={styles['documents-space']}>
                    <NewDocument/>
                    {documents.map((el) => <Document key={el.title} title={el.title} image={el.thumbnail}/>)}
                </div>
            </section>
            <section className={isDrawer ? `${styles.templates} ${styles.active}` : styles['templates']}>
                <div className={`${styles['templates-options']}`}>
                    {templates.map(el => <Template key={el.title} title={el.title} isDrawer={isDrawer} image={el.thumbnail}/>)}
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
        </div>
    )
}

const NewDocument = () => {
    return (
        <div className={`${styles['new-doc']}`}>
            <FontAwesomeIcon icon="fa-solid fa-plus"/>
        </div>
    )
}

const Document = ({image}) => {


    return (
        <div className={`${styles['single-doc']}`}>
            <img className={`${styles.images}`} src={image} />
        </div>
    )
}

const Template = ({isDrawer, image}) => {

    return (
        <div className={isDrawer ? `${styles['single-template']} ${styles.active}` : `${styles['single-template']}`}>
            <img className={`${styles.images}`} src={image} />
        </div>
    )
}

export default Dashboard;
