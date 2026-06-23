import Panel from "../components/Panel";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import settingsResource from "../../api/resources/settings";
import Input from "../components/Input";
import Label from "../components/Label";
import Checkbox from "../components/Checkbox";
import InputPassword from "../components/InputPassword";
import Button from "../components/Button";
import {useForm} from "react-hook-form";

const ServerSettings = () => {

    const {t} = useTranslation();
    const [settings, setSettings] = useState();

    const {register, handleSubmit, formState: {errors}} = useForm();

    const fetchSettings = async () => {
        const res = await settingsResource.server.list();
        setSettings(res);
    };

    const saveServerSettings = data => {
        // Convert array fields
        if (data.tags !== undefined) {
            data.tags = typeof data.tags === 'string' ? data.tags.split(',').map(s => s.trim()).filter(Boolean) : data.tags;
        }
        if (data.admins !== undefined) {
            data.admins = typeof data.admins === 'string' ? data.admins.split(',').map(s => s.trim()).filter(Boolean) : data.admins;
        }
        // Keep _comment fields from original settings
        Object.keys(settings).forEach(key => {
            if (key.startsWith("_comment")) {
                data[key] = settings[key];
            }
        });
        settingsResource.server.update(data)
            .then(() => {
                fetchSettings()
                    .then(() => window.flash(t('serverSettings.saved'), "green"))
            });
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const renderField = (name, value, label = null) => {
        if (name.startsWith("_comment_")) {
            return null;
        }

        switch (typeof value) {
            case "number":
                return (
                    <>
                        <Label htmlFor={name} text={label}/>
                        <Input type="number" register={register(name, {valueAsNumber: true})} defaultValue={value} />
                    </>
                );
            case "string":
                if (name.includes("password")) {
                    return (
                        <>
                            <Label htmlFor={name} text={label}/>
                            <InputPassword name={name} register={register(name)} defaultValue={value}/>
                        </>
                    );
                } else {
                    return (
                        <>
                            <Label htmlFor={name} text={label}/>
                            <Input name={name} register={register(name)} defaultValue={value}/>
                        </>
                    );
                }
            case "boolean":
                return (
                    <Checkbox checked={value} text={label} register={register(name)} name={name}/>
                );
            case "object":
                if (Array.isArray(value)) {
                    return (
                        <>
                            <Label htmlFor={name} text={label}/>
                            <Input name={name} register={register(name)} defaultValue={value.join(',')}/>
                        </>
                    );
                } else if (name.includes("visibility")) {
                    return (
                        <>
                            <Label text={t('serverSettings.visibility')}/>
                            <div className="flex">
                                {Object.keys(value).map(key => (
                                    <div className="mr-4" key={`visibility-${key}`}>
                                        <Checkbox
                                            checked={value[key]}
                                            register={register('visibility-' + key)}
                                            text={key}
                                            name={'visibility-' + key}
                                        />
                                    </div>
                                ))}
                            </div>
                        </>
                    );
                }
                break;
            default:
                return (
                    <>
                        <Label htmlFor={name} text={label}/>
                        <Input name={name} register={register(name)} defaultValue={value}/>
                    </>
                );
        }
    };

    return (
        <form className="mb-4" onSubmit={handleSubmit(saveServerSettings)}>
            <Panel
                title={t('serverSettings.title')}
                content={
                    <>
                        {settings && Object.keys(settings).map(key => {
                            if (key.startsWith("_comment_")) {
                                return null;
                            }

                            const value = settings[key];
                            const label = key.replaceAll('_', ' ');
                            const comment = settings["_comment_" + key];

                            return (
                                <div className="mb-4" key={`wrapper-${key}`}>
                                    {renderField(key, value, label)}
                                    <p className="text-sm italic">{comment}</p>
                                </div>
                            );
                        })}
                    </>
                }
                actions={
                    <Button isSubmit={true} type="success">{t('common.save')}</Button>
                }
            />
        </form>
    );
};

export default ServerSettings;
