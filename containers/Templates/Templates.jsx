import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { Grid, Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import styles from './Templates.module.scss';

import { GET_TEMPLATES, DELETE_TEMPLATE } from '../../graphql/templates';

export const Templates = () => {
    const history = useHistory();
    const { loading, error, data, refetch } = useQuery(GET_TEMPLATES, {
        fetchPolicy: 'cache-and-network'
    });
    const [deleteTemplate, { data: mutationData, loading: mutationLoading }] = useMutation(DELETE_TEMPLATE);

    useEffect(() => {
        if ( mutationLoading === false && mutationData ) refetch();
    }, [mutationLoading]);

    const handleDeleteTemplate = (id) => {
        deleteTemplate({ variables: { id } });
    }

    const handleEditTemplate = (id) => {
        history.push(`/templates/${id}`);
    }

    return (
        <>
            <Grid
                container
                alignItems='center'
                justify="space-between"
                className={styles.header}
            >
                <h1>Templates</h1>
                <Button variant="contained" color="primary">
                    <Link className={styles.link} to="/create-template">Create</Link>
                </Button>
            </Grid>
            {data && (
                data.templates.length ?
                    <div>
                        {data.templates.map(template => (
                            <div key={template.id} className={styles['template-item']}>
                                <h3>{template.id}</h3>
                                <div>
                                    <EditIcon onClick={() => handleEditTemplate(template.id)} />
                                    <DeleteIcon onClick={() => handleDeleteTemplate(template.id)} />
                                </div>
                            </div>
                        ))}
                    </div>
                :
                    <h3 className={styles['not-found-message']}>Templates not found</h3>
            )}
        </>
    )
}
