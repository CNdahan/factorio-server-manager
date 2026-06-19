import {useForm} from "react-hook-form";
import React from "react";
import {useTranslation} from "react-i18next";
import user from "../../../../api/resources/user";
import Button from "../../../components/Button";
import Label from "../../../components/Label";
import Input from "../../../components/Input";
import Error from "../../../components/Error";

const CreateUserForm = ({updateUserList}) => {
    const {t} = useTranslation();
    const roleValue = "admin";

    const {
        register,
        handleSubmit,
        formState: {errors},
        watch
    } = useForm({
        values: {
            role: roleValue,
        }
    });
    const password = watch('password');

    const onSubmit = async (data) => {
        const res = await user.add(data);
        if (res) {
            updateUserList()
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
                <Label htmlFor="username" text={t('common.username')}/>
                <Input register={register('username', {required: true})}
                       type="text"
                       placeholder={t('common.username')}
                />
                <Error error={errors.username} message={t('userManagement.usernameRequired')}/>
            </div>
            <div className="mb-4">
                <Label htmlFor="role" text={t('common.role')}/>
                <Input register={register('role', {required: true})}
                       value={roleValue}
                       disabled={true}
                       placeholder={t('common.role')}
                />
                <Error error={errors.role} message={t('userManagement.roleRequired')}/>
            </div>
            <div className="mb-4">
                <Label htmlFor="email" text={t('common.email')}/>
                <Input register={register('email', {required: true})}
                       type="email"
                       placeholder={t('common.email')}
                />
                <Error error={errors.email} message={t('userManagement.emailRequired')}/>
            </div>
            <div className="mb-4">
                <Label htmlFor="password" text={t('common.password')}/>
                <Input register={register('password', {required: true})}
                       type="password"
                       placeholder={t('common.password')}
                />
                <Error error={errors.password} message={t('userManagement.passwordRequired')}/>
            </div>
            <div className="mb-4">
                <Label htmlFor="password_confirmation" text={t('userManagement.passwordConfirmation')}/>
                <Input register={register('password_confirmation', {
                            required: true,
                            validate: conformation => conformation === password
                        })}

                       type="password"
                       placeholder={t('userManagement.passwordConfirmation')}
                />
                <Error error={errors.password_confirmation}
                       message={t('userManagement.passwordConfirmationRequired')}/>
            </div>
            <Button isSubmit={true} type="success">{t('common.save')}</Button>
        </form>
    )
}

export default CreateUserForm;
