import {useForm} from "react-hook-form";
import Button from "../../../components/Button";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import saves from "../../../../api/resources/saves";
import Label from "../../../components/Label";
import Input from "../../../components/Input";
import Error from "../../../components/Error";

const CreateSaveForm = ({onSuccess}) => {
    const {t} = useTranslation();
    const {register, handleSubmit, formState: {errors}} = useForm();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data, e) => {
        setIsLoading(true)
        saves.create(data.savefile)
            .then(() => {
                e.target.reset();
                onSuccess();
            })
            .finally(() => setIsLoading(false))
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-6">
                <Label text={t('saves.savefileName')} htmlFor="savefile"/>
                <Input register={register('savefile', {required: true})}/>
                <Error error={errors.savefile} message={t('saves.savefileNameRequired')}/>
            </div>
            <Button type="success" isLoading={isLoading} isSubmit={true}>{t('saves.createSaveBtn')}</Button>
        </form>
    )
}

export default CreateSaveForm;
