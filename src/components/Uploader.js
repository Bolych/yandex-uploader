import React, { useState } from 'react';
import axios from 'axios';

export const Uploader = () => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [warning, setWarning] = useState("");

    const token = 'Your token'

    const handleFileChange = (event) => {
        if (event.target.files.length > 100 || selectedFiles.length + event.target.files.length > 100) {
            setWarning("Ошибка. Вы можете выбрать до 100 файлов.");
        } else {
            setSelectedFiles(selectedFiles.concat([...event.target.files]));
            setWarning("");
        }
    }

    const deleteFile = (index) => {
        setSelectedFiles(selectedFiles.filter((file, i) => i !== index));
    }

    const clearFiles = () => {
        setSelectedFiles([]);
    }

    const uploadFiles = async () => {
        for (const file of selectedFiles) {
            const formData = new FormData();
            formData.append('file', file);

            const uploadUrl = await axios.get(`https://cloud-api.yandex.net/v1/disk/resources/upload?path=${file.name}`, {
                headers: {
                    'Authorization': `OAuth ${token}`
                },
            });

            await axios.put(uploadUrl.data.href, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `OAuth ${token}`
                },
            });
        }
    }

    return (
        <div className="container" >
            <div style={{alignSelf: "center", padding: "1em"}}>
                <h1>Загрузить файлы на Яндекс</h1>

            </div>
            <input type="file" multiple onChange={handleFileChange} className="file-input" />
            {warning && <p className="warning-text">{warning}</p>}
            <ul className="file-list">
                {selectedFiles.map((file, index) => (
                    <li className="file-list-item" key={index}>
                        <div style={{overflow: 'hidden'}}>
                        {index + 1}. {file.name}
                        </div>
                        <button onClick={() => deleteFile(index)} className='delete-icon'>✖</button>
                    </li>
                ))}
            </ul>
            <div className="button-container">
                {selectedFiles.length > 0 && <button onClick={clearFiles} className="clear-button">Очистить</button>}
                <button onClick={uploadFiles} className="upload-button">Загрузить</button>
            </div>
        </div>
    );

    }