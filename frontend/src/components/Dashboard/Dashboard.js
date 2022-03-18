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

const Dashboard = (props) => {

    const [isDrawer, setDrawer] = useState(false);
    const [isLoaded, setLoaded] = useState(false);
    const [templates, setTemplates] = useState([]);
    const [documents, setDocuments] = useState([]);
    // this may mount the builder component

    useEffect(() => {
        loadData();
    }, []);

    function loadData() {
        fetch('url').then((response) => {
            setTemplates([])
            setDocuments([])
        }).then((response) => {
                setLoaded(true);
            }
        ).catch((err) => {
            console.error(err)
            setLoaded(false);
        })
    }

    return (
        <div className={styles['page-root']}>
            <section className={styles['workspace']}>
                <div className={styles['documents-space']}>
                    <NewDocument/>
                    {documents.map((el) => <Document key={el.title} title={el.title}/>)}
                </div>
            </section>
            <section className={isDrawer ? `${styles.templates} ${styles.active}` : styles['templates']}>
                <div className={`${styles['templates-options']}`}>
                    {templates.map(el => <Template key={el.title} title={el.title} isDrawer={isDrawer}/>)}
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

const Document = props => {


    return (
        <div className={`${styles['single-doc']}`}>

        </div>
    )
}

const Template = ({isDrawer}) => {

    return (
        <div className={isDrawer ? `${styles['single-template']} ${styles.active}` : `${styles['single-template']}`}>

        </div>
    )
}

export default Dashboard;
