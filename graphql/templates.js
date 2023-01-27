import { gql } from '@apollo/client';

export const GET_TEMPLATES = gql`
    query GetTemplates {
        templates {
            id
            body
            createdAt
            updatedAt
        }
    }
`;

export const GET_TEMPLATE = gql`
    query GetTemplate($id: ID!) {
        template(id: $id) {
            id
            body
            createdAt
            updatedAt
        }
    }
`;

export const CREATE_TEMPLATE = gql`
    mutation CreateTemplate($body: JSON!) {
        createTemplate(body: $body) {
            id
            body
            createdAt
            updatedAt
        }
    }
`;

export const UPDATE_TEMPLATE = gql`
    mutation UpdateTemplate($id: ID!, $body: JSON!) {
        updateTemplate(id: $id, body: $body) {
            id
            body
            createdAt
            updatedAt
        }
    }
`;

export const DELETE_TEMPLATE = gql`
    mutation DeleteTemplate($id: ID!) {
        deleteTemplate(id: $id)
    }
`;

export const SEND_TEST_EMAIL = gql`
    mutation SendTestEmail($email: String!, $html: String!) {
        sendTestEmail(email: $email, html: $html)
    }
`;