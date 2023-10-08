import { parse } from ':/lib/util';
import { PageAccountProps } from ':/pages/p/[player]/[matchup]';
import { Button, Center, FormControl, FormErrorMessage, FormLabel, Input, Spacer } from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import React, { useId } from 'react';

export type SubmitMatchFormProps = {
    data: PageAccountProps['data']
}

export function SubmitMatchForm({ data }: SubmitMatchFormProps) {
    const theirBuild = useId();
    const myBuild = useId();
    const change = useId();
    const why = useId();
    
    return (
        <Formik
            initialValues={{
                theirBuild: '',
                myBuild: '',
                change: '',
                form: '',
                why: '',
            }}
            onSubmit={async (values, actions) => {
                const buildId = parse.number(values.theirBuild);
                const build = buildId === null
                    ? values.theirBuild
                    : data.builds[buildId - 1].description;
                
                const body = JSON.stringify({
                    name: data.name,
                    their: build,
                    mine: values.myBuild,
                    change: parse.number(values.change),
                    why: values.why,
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
                    <FormControl isInvalid={!!errors.theirBuild && !!touched.theirBuild}>
                        <FormLabel fontSize="sm" pt={2} htmlFor={theirBuild}>
                            Their Build
                        </FormLabel>
                        <Field
                            as={Input}
                            id={theirBuild}
                            autoFocus
                            autoComplete="off"
                            name="theirBuild"
                            variant="filled"
                            validate={(value: string) => {
                                const parsed = parse.number(value);
                                if(parsed !== null) {
                                    if(data.builds[parsed - 1] === undefined) return 'Not a build';
                                }
                            }}
                        />
                        <FormErrorMessage>
                            {errors.theirBuild}
                        </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.myBuild && !!touched.myBuild}>
                        <FormLabel fontSize="sm" pt={2} htmlFor={myBuild}>
                            My Build
                        </FormLabel>
                        <Field
                            as={Input}
                            id={myBuild}
                            autoFocus
                            autoComplete="off"
                            name="myBuild"
                            variant="filled"
                        />
                        <FormErrorMessage>
                            {errors.myBuild}
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
                    <FormControl isInvalid={!!errors.why && !!touched.why}>
                        <FormLabel fontSize="sm" pt={2} htmlFor={why}>
                            Because
                        </FormLabel>
                        <Field
                            as={Input}
                            id={why}
                            autoComplete="off"
                            name="why"
                            variant="filled"
                            validate={(value: string) => {
                                if(value.length < 3) return 'Not optional';
                            }}
                        />
                        <FormErrorMessage>
                            {errors.why}
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