import {useForm} from "react-hook-form";
import React from "react";
import {useTranslation} from "react-i18next";
import user from "../../../../api/resources/user";
import Button from "../../../components/Button";
import Label from "../../../components/Label";
import Input from "../../../components/Input";
import Error from "../../../components/Error";

const ChangePasswordForm = () => {
    const {t} = useTranslation();
    const {register, handleSubmit, reset, formState: {errors}, watch} = useForm();

    const new_password = watch("new_password");

    const onSubmit = async (data) => {
        const res = await user.changePassword(data);
        if (res) {
            // Update successful
            window.flash(t('userManagement.passwordChanged'), "green")
            reset();
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
                <Label htmlFor="old_password" text={t('userManagement.oldPassword')}/>
                <Input register={register('old_password',{required: true})}
                       type="password"
                       placeholder={t('userManagement.oldPassword')}
                />
                <Error error={errors.old_password} message={t('userManagement.oldPasswordRequired')}/>
            </div>
            <div className="mb-4">
                <Label htmlFor="new_password" text={t('userManagement.newPassword')}/>
                <Input register={register('new_password',{required: true})}
                       type="password"
                       placeholder={t('userManagement.newPassword')}
                />
                <Error error={errors.new_password} message={t('userManagement.newPasswordRequired')}/>
            </div>
            <div className="mb-4">
                <Label htmlFor="new_password_confirmation" text={t('userManagement.newPasswordConfirmation')}/>
                <Input register={register('new_password_confirmation',{required: true, validate: value => value === new_password})}
                       type="password"
                       placeholder={t('userManagement.newPassword')}
                />
                <Error error={errors.new_password_confirmation} message={t('userManagement.newPasswordConfirmationRequired')}/>
            </div>
            <Button isSubmit={true} type="success">{t('common.change')}</Button>
        </form>
    )
}

export default ChangePasswordForm
