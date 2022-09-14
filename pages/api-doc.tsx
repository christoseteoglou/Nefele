import { GetStaticProps, InferGetStaticPropsType } from "next";
import { createSwaggerSpec } from 'next-swagger-doc';
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic<{
    spec: any
}>(import('swagger-ui-react'), { ssr: false });

function ApiDoc({ spec }: InferGetStaticPropsType<typeof getStaticProps>) {
    return <SwaggerUI spec={spec} />;
}

export const getStaticProps: GetStaticProps = async () => {
    const spec: Record<string, any> = createSwaggerSpec({
        definition: {
            openapi: '3.0.3',
            info: {
                title: 'Nefele API',
                version: '1.0.0'
            },
            produces: ['application/json'],
            servers: [
                { url: 'http://localhost:3000' }
            ],
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT'
                    }
                }
            },
            security: [{ bearerAuth: [] }]
        },
        apiFolder: 'pages/api',
        schemaFolders: ['models']
    });

    return {
        props: {
            spec
        }
    };
}

export default ApiDoc;