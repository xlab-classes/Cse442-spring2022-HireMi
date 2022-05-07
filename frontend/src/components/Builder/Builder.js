import React, {useState, useEffect} from 'react';
import {makeStyles} from "@material-ui/core/styles";
// import Grid from "@material-ui/core/Grid";
import Box from "@mui/material/Box";
import styles from './Builder.module.scss';
import {Rnd} from "react-rnd";
import {sampleRawData} from "./hardCodedData.js";
import html2canvas from 'html2canvas';
import {parse} from "@fortawesome/fontawesome-svg-core";
import Button from '@material-ui/core/Button';
import {useRef} from 'react/cjs/react.production.min';

const styling = makeStyles({
    container: {
        height: "50%",
        minHeight: 820,
        textAlign: "center",
    }
});

const tempData = sampleRawData

const Builder = ({auth, resume, setEditor, setResume}) => {
    const columns = styling();

    const [mappedData, updateData] = useState(null);
    // Increment for tracking newly added object
    const [increment, setIncrement] = useState(null);
    // state to set active status of deleting an element
    const [isSelect, setSelect] = useState({
        active: false,
        id: null,
    });
    const [isDragging, setDragging] = useState(false);

    const [share, setShare] = useState(true);

    useEffect(() => {

        const loadingElements = async () => {

            const resume_id = parseInt(resume.split('-')[0]);
            //This gets the number of resumes in entire database, not just the ones the user owns.
            const resumeCount = await fetch('./backend/api/api.php/resume_count', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + auth?.access_token
                },
                body: JSON.stringify({
                    'id': auth?.id
                })
            }).catch(err => {
                console.error(err)
            });

            const resumeCountJSON = await resumeCount.json();

            //Checks if loading resume is a template.
            //If it is, then we create a new resume that is owned by user.
            if (resume.split('-')[1] === 'template') {
                setResume((resumeCountJSON.count + 1) + '-doc');
            }
            else {
                // console.log('resume_id', resume_id);
                if (resumeCountJSON.count === resume_id - 1) {
                    // console.log('saving new doc', resume_id);
                    await encodeData([]);
                    return;
                }
            }
            // console.log('loading elements', resume_id);
            const resumeData = await fetch('./backend/api/api.php/get_resume', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + auth?.access_token
                },
                body: JSON.stringify({
                    'id': auth?.id,
                    'resume_id': resume_id
                })
            }).catch(err => console.log(err));

            const resumeDataJSON = await resumeData.json();

            // console.log('resumeDataJSON', resumeDataJSON);

            let loadedShare = (resumeDataJSON['share'] == 1);
            setShare(loadedShare);
            console.log(resumeDataJSON);
            const parsedData = resumeDataJSON['elements'].reduce((obj, el) => {
                const id = obj['prev'] + 1;
                return (
                    {
                        ...obj,
                        prev: id,
                        [id]: {
                            ...el,
                            'content': el['type'] === "image" ? 'data:image/png;base64,' + el['content'] : el['content']
                        },
                    }
                )
            }, {prev: 0})

            setIncrement(parsedData['prev'] + 1);
            updateData(parsedData); // updates mapped data

            if(resume.split('-')[1] === 'template') {
                await encodeData(parsedData, resumeCountJSON.count+1);
                await fetch('./backend/api/api.php/set_shared',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + auth?.access_token
                    },
                    body: JSON.stringify({
                        'id': auth?.id,
                        'resume_id': resumeCountJSON.count+1,
                        'shared': loadedShare
                    }),
                });
            }
            else{
                await encodeData(parsedData);
                await fetch('./backend/api/api.php/set_shared',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + auth?.access_token
                    },
                    body: JSON.stringify({
                        'id': auth?.id,
                        'resume_id': parseInt(resume.split('-')[0]),
                        'shared': loadedShare
                    }),
                });
            }

        }

        loadingElements()
            .catch(console.error);
    }, []);

    function renderData() {
        // assume that we fetched the data successfully
        const remapped = tempData["elements"].reduce(
            (obj, el) => {
                const id = obj['prev'] + 1;
                return (
                    {
                        ...obj,
                        prev: id,
                        [id]: {
                            ...el
                        }
                    }
                )
            }
            , { prev: 0 }
        )

        setIncrement(remapped['prev'] + 1);
        updateData(remapped);
    }

    // This function needs to be paired with the save using fetch API
    async function encodeData(formattedData, resumeID = -1) {
        if(resumeID === -1){
            resumeID = parseInt(resume.split('-')[0]);
        }
        const filteredData = Object.values(formattedData).filter(el => {
            if (typeof el === 'object') {
                return el
            } else {
                return null
            }
        })

        // Upload filteredData to push it to the server
        const thumbnail = await capture();
        const processed = filteredData.map((el) => {

            let result = {...el};
            result.content = el['type'] === "image" ? el['content'].split(',')[1] : el['content'];
            return result;
        })

        return saveElements(processed, thumbnail.split(',')[1], resumeID); //pass only data, no prefix
    }

    async function saveElements(encodedData, thumbnail, resumeID) {
        const result = await fetch('./backend/api/api.php/resume', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + auth?.access_token
            },
            body: JSON.stringify({
                'id': auth?.id,
                'thumbnail': thumbnail,
                'data': {
                    'resume_id': resumeID,
                    'share': share,
                    'elements': encodedData
                }
            })
        });

        return result;
    }

    const capture = async () => {
        const element = document.getElementsByClassName('MuiBox-root css-s2v7vp');
        const canvas = await html2canvas(element[0]);
        const link = canvas.toDataURL("image/png");
        return link;
    }

    async function download() {
        const response = await encodeData(mappedData); //should save before download
        const responseText = await response.text();
        console.log(responseText);

        //resume.split('-')[0] returns a string of an int, which is okay in this case
        const url = './backend/api/' + resume.split('-')[0] + '.pdf';

        const stringURL = url.toString();
        const a = document.createElement('a')
        a.href = stringURL
        a.download = stringURL.split('/').pop()
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }

    function convertBase64(file) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = error => {
                reject(error);
            }
        });
    }

    // Add TEXT

    function addText() {
        const currentPrev = increment

        const newData = {
            ...mappedData,
            [currentPrev]: {
                "type": "text",
                "content": "text element",
                "offset-x": 0,
                "offset-y": 0,
                "width": 100,
                "height": 30,
                "z-index": 1,
                "prop": { "font-type": "arial", "font-size": 12 }
            },
            prev: currentPrev
        }

        updateData(newData);
        setIncrement(increment + 1)

    }

    async function addImage(e) {
        const currentPrev = increment

        const file = e.target.files[0];
        const base64 = await convertBase64(file);

        let img = new Image;
        img.onload = () => {
            const newData = {
                ...mappedData,
                [currentPrev]: {
                    "type": "image",
                    "offset-x": 0,
                    "offset-y": 0,
                    "width": img.width ? img.width : 100,
                    "height": img.height ? img.height : 100,
                    "z-index": 1,
                    "content": base64,
                    "prop": {}
                },
                prev: currentPrev
            }

            updateData(newData);
            setIncrement(increment + 1)
        }
        img.src = base64
    }

    const addImgRef = useRef();

    function controlElement(e, id) {
        if (isSelect['active'] && isSelect['id'] !== id) {
            setSelect({
                active: true,
                id: id
            });
        } else {
            setSelect({
                active: !isSelect['active'],
                id: isSelect['id'] ? null : id
            });
        }
    }

    function deleteElement(id) {

        const updatedMap = {
            ...mappedData
        }

        delete updatedMap[id]

        setSelect({
            active: false,
            id: null
        });
        updateData(updatedMap);
    }


    const increaseFS = (id) => {
        const updatedMap = {
            ...mappedData
        }

        updatedMap[id]["prop"]["font-size"] = updatedMap[id]["prop"]["font-size"] + 1;

        updateData(updatedMap);
    };
    const decreaseFS = (id) => {
        const updatedMap = {
            ...mappedData
        }
        if (updatedMap[id]["prop"]["font-size"] <= 1) {
            updatedMap[id]["prop"]["font-size"] = 1;
        } else {
            updatedMap[id]["prop"]["font-size"] = updatedMap[id]["prop"]["font-size"] - 1;
        }

        updateData(updatedMap);
    };
    const boldF = (id) => {
        const updatedMap = {
            ...mappedData
        }

        updatedMap[id]["prop"]["bold"] = !updatedMap[id]["prop"]["bold"];
        updateData(updatedMap);
    };
    const italF = (id) => {
        const updatedMap = {
            ...mappedData
        }

        updatedMap[id]["prop"]["italic"] = !updatedMap[id]["prop"]["italic"];
        updateData(updatedMap);
    };
    const underF = (id) => {
        const updatedMap = {
            ...mappedData
        }

        updatedMap[id]["prop"]["underline"] = !updatedMap[id]["prop"]["underline"];
        updateData(updatedMap);
    };
    const shareResume = async () => {
        // await encodeData(mappedData);
        // const result = await fetch('./backend/api/api.php/set_shared', {
        fetch('./backend/api/api.php/set_shared',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + auth?.access_token
            },
            body: JSON.stringify({
                'id': auth?.id,
                'resume_id': parseInt(resume.split('-')[0]),
                'shared': !share
            }),
        })
        setShare(!share);
    }

    const style_temp = {
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center',
    }


    const renderedData = Object.entries(mappedData ? mappedData : {}).map(el => {
        if (el[0] === 'prev') {
            return null;
        }

            return (
                <Rnd
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        textAlign: 'center',
                        border: !isDragging && isSelect['active'] && el[0] === isSelect['id'] ? '3px solid #d9ceeb' : 'none',
                    }}
                    default={{
                        x: el[1]['offset-x'],
                        y: el[1]['offset-y'],
                        width: el[1]['width'],
                        height: el[1]['height']
                    }}
                    key={el[0]}

                    onDragStart={e => {
                        setDragging(true)
                    }}
                    onDrag={e => {
                        if (!isSelect['active']) {
                            return
                        }
                        setSelect({
                            active: false,
                            id: null
                        })
                    }}
                    onDragStop={(e, data) => {
                        setDragging(false)

                    const updated = {
                        ...mappedData,
                        [el[0]]: {
                            ...mappedData[el[0]],
                            'offset-x': data['x'],
                            'offset-y': data['y'],
                        }
                    }

                    updateData(updated);
                }}
                onResizeStop={(e, dir, ref, delta, position) => {
                    const updated = {
                        ...mappedData,
                        [el[0]]: {
                            ...mappedData[el[0]],
                            width: mappedData[el[0]]['width'] + delta['width'],
                            height: mappedData[el[0]]['height'] + delta['height'],
                            'offset-x': position['x'],
                            'offset-y': position['y'],
                        }
                    }

                    updateData(updated);
                }}

                onMouseDown={e => {
                    // if(isDragging) return;

                    // controlElement(e, el[0])

                        setTimeout(() => {
                            if (isDragging) return;
                            controlElement(e, el[0])
                        }, 50);
                    }}

                >
                    {el[1]['type'] === 'text' ?
                        <input
                            type="text"
                            defaultValue={el[1]['content']}
                            style={{
                                width: '100%',
                                height: '100%',
                                fontSize: el[1]['prop']['font-size'],
                                fontWeight: el[1]['prop']['bold'] ? 'bold' : 'normal',
                                fontStyle: el[1]['prop']['italic'] ? 'italic' : 'normal',
                                textDecorationLine: el[1]['prop']['underline'] ? 'underline' : 'none',
                                border: 'none',
                                // textAlign: 'center',
                            }}
                            onChange={e => {
                                const str = e.target.value;

                            const updated = {
                                ...mappedData,
                                [el[0]]: {
                                    ...mappedData[el[0]],
                                    content: str
                                }
                            }

                            updateData(updated);
                        }}
                    /> :
                    <img src={el[1]['content']} alt={''} draggable={false}
                        style={{
                            width: '100%',
                            height: '100%',
                        }}
                    />
                }
            </Rnd>
        )

    }
    );


    return (
        <div className={styles['page-root']}>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '320px 629px 320px',
                    justifyContent: 'space-around'
                }}>
                <aside>
                    <div className={styles['dnd']}>
                        {/* <div className={columns.container}> */}
                        <h1 className={styles['dnd_h1']}>Drag and Drop</h1>
                        <div className={styles['left_buttons_area']}>
                            <button onClick={addText} className={styles['add_text_button']}>
                                Add Text
                            </button>
                            <button className={styles['add_image_button']}
                                    onClick={() => addImgRef.current.click()}>Upload Image
                            </button>
                            <input type='file' id={styles['add_image_button']} accept="image/*" onChange={addImage}
                                   ref={addImgRef} multiple={false} hidden/>
                            {isSelect['active'] ? <button className={styles['delete_element_button']}
                                                          onClick={() => deleteElement(isSelect['id'])}>
                                Delete element
                            </button> : <button className={styles['delete_disabled']} disabled={true}>
                                Delete element
                            </button>}
                        </div>

                    </div>
                </aside>
                <section>
                    <div className={styles['middle']}>
                        <div className={columns.container}>
                            <div className={styles['resume']}>
                                <Box sx={{
                                    width: 629,
                                    height: 814,
                                    border: ".5px solid black",
                                    background: "white"
                                }}
                                     onMouseDown={e => {
                                         if (isSelect['active']) {
                                             setSelect({
                                                 active: false,
                                                 id: null
                                             });
                                         }
                                     }}
                                >
                                    {renderedData}
                                </Box>
                            </div>
                        </div>
                    </div>
                </section>
                <aside>
                    <div className={styles['cus']}>
                        <h2 className={styles['cus_h2']}>Customize!</h2>
                        <div className={styles['textEdit']}>
                            <Box sx={{
                                width: 200,
                                height: 286,
                                background: "#ffff",
                                margin: '0 auto'
                            }}>
                                <h3 className={styles['txt_h3']}>Text</h3>
                                <Box className={styles['fontSize_box']} sx={{
                                    display: "flex",
                                    width: "5vh",
                                    height: "5vh"
                                }}>
                                    <button
                                        className={isSelect['active'] ? mappedData[isSelect['id']]['type'] !== 'text' ? styles['increase_disabled'] : styles['increase'] : styles['increase_disabled']}
                                        disabled={isSelect['active'] ? mappedData[isSelect['id']]['type'] !== 'text' : true}
                                        onClick={() => {
                                            if (!isSelect['active']) {
                                                return
                                            }
                                            if (mappedData[isSelect['id']]['type'] !== 'text') {
                                                return
                                            }
                                            decreaseFS(isSelect['id']);
                                        }}
                                    >A-
                                    </button>
                                    <input
                                        // type={'number'}
                                        className={styles["fontSize_input"]}
                                        disabled={isSelect['active'] ? mappedData[isSelect['id']]['type'] !== 'text' : true}
                                        value={isSelect['active'] ? mappedData[isSelect['id']]['prop']['font-size'] : ''}
                                        onChange={e => {
                                            const val = e.target.value === '' ? 0 : e.target.value;

                                            if (!isSelect['active']) {
                                                return
                                            }
                                            if (mappedData[isSelect['id']]['type'] !== 'text') {
                                                return
                                            }
                                            const updatedMap = {
                                                ...mappedData,
                                            }

                                            updatedMap[isSelect['id']]['prop']['font-size'] = parseInt(val);

                                            updateData(updatedMap);

                                        }}
                                    />
                                    <button
                                        className={isSelect['active'] ? mappedData[isSelect['id']]['type'] !== 'text' ? styles['increase_disabled'] : styles['increase'] : styles['increase_disabled']}
                                        disabled={isSelect['active'] ? mappedData[isSelect['id']]['type'] !== 'text' : true}
                                        onClick={() => {
                                            if (!isSelect['active']) {
                                                return
                                            }
                                            if (mappedData[isSelect['id']]['type'] !== 'text') {
                                                return
                                            }
                                            increaseFS(isSelect['id']);
                                        }}
                                    >A+
                                    </button>
                                </Box>
                                <Box className={styles['text_buttons']} sx={{
                                    display: "flex",
                                    justifyContent: 'center'
                                }}>
                                    <button
                                        className={isSelect['active'] ? mappedData[isSelect['id']]['type'] !== 'text' ? styles['bold_disabled'] : styles['bold'] : styles['bold_disabled']}
                                        disabled={isSelect['active'] ? mappedData[isSelect['id']]['type'] !== 'text' : true}
                                        onClick={() => {
                                            if (!isSelect['active']) {
                                                return
                                            }
                                            if (mappedData[isSelect['id']]['type'] !== 'text') {
                                                return
                                            }
                                            boldF(isSelect['id']);
                                        }}>Bold
                                    </button>
                                    <button
                                        className={isSelect['active'] ? mappedData[isSelect['id']]['type'] !== 'text' ? styles['italicized_disabled'] : styles['italicized'] : styles['italicized_disabled']}
                                        disabled={isSelect['active'] ? mappedData[isSelect['id']]['type'] !== 'text' : true}
                                        onClick={() => {
                                        if (!isSelect['active']) {
                                            return
                                        }
                                        if (mappedData[isSelect['id']]['type'] !== 'text') {
                                            return
                                        }
                                        italF(isSelect['id']);
                                    }}>Italic
                                    </button>
                                    <button
                                        className={isSelect['active'] ? mappedData[isSelect['id']]['type'] !== 'text' ? styles['underline_disabled'] : styles['underline'] : styles['underline_disabled']}
                                        disabled={isSelect['active'] ? mappedData[isSelect['id']]['type'] !== 'text' : true}
                                        onClick={() => {
                                        if (!isSelect['active']) {
                                            return
                                        }
                                        if (mappedData[isSelect['id']]['type'] !== 'text') {
                                            return
                                        }
                                        underF(isSelect['id']);
                                    }}>U
                                    </button>
                                </Box>
                            </Box>
                        </div>
                        <div className={styles['right_buttons_area']}>
                            <button className={styles['save_button']} onClick={() => encodeData(mappedData)}>
                                Save Resume
                            </button>
                            <button className={styles['download_button']} onClick={() => {
                                download()
                            }}>
                                Download PDF
                            </button>
                            <button className={styles['close_button']} onClick={() => {
                                setResume(null)
                                setEditor(false)
                            }}> Close Editor
                            </button>
                            <label className={styles['customPublicLabel']}>
                                <input 
                                type="checkbox"
                                // defaultChecked={share}
                                checked={share}
                                onChange={shareResume}
                                className={styles['customCheckBox']}
                                />
                                <span className={styles['customCheck']}></span>
                                Make Public
                            </label>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );

}

export default Builder;
