import Panel from "../../components/Panel";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import modsResource from "../../../api/resources/mods";
import Button from "../../components/Button";
import server from "../../../api/resources/server";
import TabControl from "../../components/Tabs/TabControl";
import Tab from "../../components/Tabs/Tab";
import UploadMod from "./components/UploadMod";
import LoadMods from "./components/LoadMods";
import CreateModPack from "./components/CreateModPack";
import ModPack from "./components/ModPack";
import ModList from "./components/ModList";

const Mods = ({serverStatus}) => {

    const {t} = useTranslation();

    const [installedMods, setInstalledMods] = useState([]);
    const [modPacks, setModPacks] = useState([])
    const [factorioVersion, setFactorioVersion] = useState(null);
    const [isDeletingAllMods, setIsDeletingAllMods] = useState(false);

    const fetchInstalledMods = () => {
        modsResource.installed()
            .then(setInstalledMods);
    };

    const fetchModPacks = () => {
        modsResource.packs.list()
            .then(setModPacks)
    }

    const deleteAllMods = () => {
        setIsDeletingAllMods(true);
        modsResource.deleteAll()
            .then(fetchInstalledMods)
            .finally(() => setIsDeletingAllMods(false))
    }

    useEffect(() => {
        server.factorioVersion()
            .then(data => {
                setFactorioVersion(data.base_mod_version)
                fetchInstalledMods();
                fetchModPacks();
            })
    }, []);

    const toggleMod = modName => {
        return modsResource
            .toggle(modName)
            .then(fetchInstalledMods)
    }

    const deleteMod = modName => {
        return modsResource
            .delete(modName)
            .then(fetchInstalledMods)
    }

    let disabled = serverStatus.running

    return (
        <div>
            {disabled ?
                <Panel className="mb-6"
                       content={
                           <div className="text-red font-bold text-xl">
                               {t('mods.disabledWarning')}
                           </div>
                       }
                />
                :
                <TabControl>
                    <Tab title={t('mods.uploadMod')}>
                        <UploadMod refetchInstalledMods={fetchInstalledMods}/>
                    </Tab>
                    <Tab title={t('mods.loadModsFromSave')}>
                        <LoadMods refreshMods={fetchInstalledMods}/>
                    </Tab>
                </TabControl>
            }
            <Panel
                title={t('mods.title')}
                className="mb-6"
                content={
                    <ModList toggleMod={toggleMod}
                             deleteMod={deleteMod}
                             mods={installedMods}
                             factorioVersion={factorioVersion}
                             disabled={disabled}
                    />
                }
                actions={
                    <>
                        {
                            !disabled &&
                            <Button size="sm" className="mr-2" type="danger" isLoading={isDeletingAllMods}
                                    onClick={deleteAllMods}>{t('mods.deleteAllMods')}</Button>
                        }
                        <a className="bg-gray-light py-1 px-2 hover:glow-orange hover:bg-orange inline-block accentuated text-black font-bold"
                           href={modsResource.downloadAllURL}>{t('mods.downloadAllMods')}</a>
                    </>
                }
            />

            <Panel
                title={t('mods.modPacks')}
                className="mb-6"
                content={
                    modPacks.map(
                        (pack, i) =>
                            <ModPack factorioVersion={factorioVersion}
                                     key={i}
                                     modPack={pack}
                                     reloadMods={fetchInstalledMods}
                                     reloadModPacks={fetchModPacks}
                                     disabled={disabled}
                            />
                    )
                }
                actions={
                    <CreateModPack onSuccess={fetchModPacks}/>
                }
            />
        </div>
    )
}

export default Mods;
