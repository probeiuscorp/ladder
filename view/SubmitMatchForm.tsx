import { parse } from ':/lib/util';
import { PageAccountProps } from ':/pages/p/[player]/[matchup]';
import { Button, Center, FormControl, FormErrorMessage, FormLabel, Input, Spacer } from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import React, { useId } from 'react';

export type SubmitMatchFormProps = {
    data: PageAccountProps['data']
}

export function SubmitMatchForm({ data }: SubmitMatchFormProps) {
    const change = useId();
    const description = useId();
    
    return (
        <Formik
            initialValues={{
                description: '',
                change: '',
                form: ''
            }}
            onSubmit={async (values, actions) => {
                const buildId = parse.number(values.description);
                const build = buildId === null
                    ? values.description
                    : data.builds[buildId - 1].description;
                
                const body = JSON.stringify({
                    name: data.name,
                    build,
                    change: parse.number(values.change),
                    me: data.me,
                    them: data.them,
                });
                
                try {
                    const res = await fetch('/api/submit', {
                        method: 'POST',
                        body,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    if(res.ok) {
                        location.reload();
                    } else {
                        actions.setFieldError('form', `HTTP ${res.status}`);
                    }
                } catch {
                    actions.setFieldError('form', 'Failed to fetch');
                }
            }}
        >
            {({ handleSubmit, errors, touched, isSubmitting }) => (
                <form style={{ width: '100%' }} onSubmit={handleSubmit}>
                    <FormControl isInvalid={!!errors.description && !!touched.change}>
                        <FormLabel fontSize="sm" pt={2} htmlFor={description}>
                            Build Description
                        </FormLabel>
                        <Field
                            as={Input}
                            id={description}
                            autoFocus
                            autoComplete="off"
                            name="description"
                            variant="filled"
                            validate={(value: string) => {
                                const parsed = parse.number(value);
                                if(parsed !== null) {
                                    if(data.builds[parsed - 1] === undefined) return 'Not a build';
                                }
                            }}
                        />
                        <FormErrorMessage>
                            {errors.description}
                        </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.change && !!touched.change}>
                        <FormLabel fontSize="sm" pt={2} htmlFor={change}>
                            MMR Change
                        </FormLabel>
                        <Field
                            as={Input}
                            id={change}
                            autoComplete="off"
                            name="change"
                            variant="filled"
                            validate={(value: string) => {
                                if(parse.number(value) === null) return 'Must be a number';
                            }}
                        />
                        <FormErrorMessage>
                            {errors.change}
                        </FormErrorMessage>
                    </FormControl>
                    <Spacer height={2}/>
                    <Center>
                        <Button colorScheme={errors.form ? 'red' : 'teal'} type="submit" size="sm" isLoading={isSubmitting}>
                            {errors.form ?? 'Yep'}
                        </Button>
                    </Center>
                </form>
            )}
        </Formik>
    );
}