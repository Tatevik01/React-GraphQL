import React, { useRef, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import EmailEditor from 'react-email-editor';
import { useMutation, useQuery } from '@apollo/client';
import { Grid, Button, ButtonGroup, TextField } from '@material-ui/core';
import styles from './Template.module.scss';

import { CREATE_TEMPLATE, GET_TEMPLATE, UPDATE_TEMPLATE, SEND_TEST_EMAIL } from '../../graphql/templates';

export const Template = () => {
    const params = useParams();
    const history = useHistory();
    const emailEditorRef = useRef(null);
    const { loading, error, data, refetch } = useQuery(GET_TEMPLATE, {
        variables: { id: params.id}
    });
    const [createTemplate, { data: createMutationData, loading: createMutationLoading }] = useMutation(CREATE_TEMPLATE);
    const [updateTemplate, { data: updateMutationData, loading: updateMutationLoading }] = useMutation(UPDATE_TEMPLATE);
    const [email, setEmail] = useState('');
    const [sendTestEmail, { data: sendTestEmailData, loading: sendTestEmailLoading }] = useMutation(SEND_TEST_EMAIL);

    useEffect(() => {
        if (
            createMutationLoading === false && createMutationData ||
            updateMutationLoading === false && updateMutationData
        ) history.push('/templates');
    }, [ createMutationLoading, updateMutationLoading ])

    useEffect(() => {
        if ( loading === false && data && emailEditorRef.current &&  emailEditorRef.current.editor ) {
            emailEditorRef.current.editor.loadDesign({...JSON.parse(data.template.body)})
        };
    }, [ loading ])

    useEffect(() => {
        if ( sendTestEmailData ) window.open(sendTestEmailData.sendTestEmail);
    }, [ sendTestEmailData ])

    const handleSaveTemplate = (mode) => {
        emailEditorRef.current.editor.saveDesign(design => {
            if (mode === 'create') {
                createTemplate({ variables: { body: JSON.stringify(design) } });
            } else {
                updateTemplate({ variables: { id: data.template.id, body: JSON.stringify(design) } });
            }
        });
    };

    const onLoad = () => {
        if ( loading === false && data && emailEditorRef.current && emailEditorRef.current.editor ) {
            emailEditorRef.current.editor.loadDesign({...JSON.parse(data.template.body)})
        };
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const handleSendTestEmail = event => {
        emailEditorRef.current.editor.exportHtml(data => {
            sendTestEmail({ variables: { email, html: data.html } });
        });
    }

    return (
        <>
            <Grid
                container
                className={styles['actions-container']}
                justify="space-between"
                alignItems="center"
            >
                <h1>{params.id || 'New Template'}</h1>
                <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
                    {params.id && (
                        <Button
                            onClick={() => handleSaveTemplate('create')}
                            disabled={createMutationLoading}
                        >
                            Save as new
                        </Button>
                    )}
                    <Button
                        onClick={() => handleSaveTemplate(params.id ? 'update' : 'create')}
                        disabled={createMutationLoading}
                    >
                        {params.id ? 'Save changes' : 'Save'}
                    </Button>
                </ButtonGroup>
            </Grid>
            <div className={styles['test-email-container']}>
                <TextField
                    label="Your email"
                    className={styles['email-input']}
                    onChange={handleEmailChange}
                    value={email}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSendTestEmail}
                    disabled={sendTestEmailLoading}
                >
                    Send test email
                </Button>
            </div>
            <EmailEditor
                minHeight='100vh'
                ref={emailEditorRef}
                onLoad={onLoad}
            />
        </>
    )
}
