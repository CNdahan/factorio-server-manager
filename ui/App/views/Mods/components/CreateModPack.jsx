import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import Button from "../../../components/Button";
import Modal from "../../../components/Modal";
import Label from "../../../components/Label";
import Input from "../../../components/Input";
import {useForm} from "react-hook-form";
import modsResource from "../../../../api/resources/mods";

const CreateModPack = ({onSuccess}) => {

    const {t} = useTranslation();
    const [isCreating, setIsCreating] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const {handleSubmit, register} = useForm();

    const createModPack = (data) => {
        setIsCreating(true);

        modsResource.packs
            .create(data.name)
            .then(onSuccess)
            .finally(() => {
                setIsCreating(false)
                setIsOpen(false);
            });
    }

    return <>
        <Button size="sm" onClick={() => setIsOpen(true)}>{t('mods.addModPack')}</Button>
        <Modal title={t('mods.createModPack')} isOpen={isOpen} content={
            <form onSubmit={handleSubmit(createModPack)}>
                <div className="mb-4">
                    <Label text={t('common.name')} htmlFor="name"/>
                    <Input register={register('name',{required: true})}/>
                </div>
                <Button size="sm" isLoading={isCreating} isSubmit={true}>{t('common.create')}</Button>
            </form>
        }
        actions={
            <Button onClick={() => setIsOpen(false)} size="sm" type="danger">{t('common.cancel')}</Button>
        }
        />
    </>
}

export default CreateModPack;
