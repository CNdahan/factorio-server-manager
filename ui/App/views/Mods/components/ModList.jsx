import Mod from "./Mod";
import React from "react";
import {useTranslation} from "react-i18next";


const ModList = ({mods, factorioVersion, updateMod, toggleMod, deleteMod, addUpdatableMod = null, disabled = false}) => {

    const {t} = useTranslation();

    return (
        <table className="w-full">
            <thead>
            <tr className="text-left py-1">
                <th>{t('common.name')}</th>
                <th>{t('common.enabled')}</th>
                <th>{t('common.compatibility')}</th>
                <th>{t('common.modVersion')}</th>
                <th>{t('common.factorioVersion')}</th>
                <th/>
            </tr>
            </thead>
            <tbody>
            {
                factorioVersion !== null && mods.map(
                    (mod, i) =>
                        <Mod mod={mod} key={i}
                             updateMod={updateMod}
                             toggleMod={toggleMod}
                             deleteMod={deleteMod}
                             addUpdatableMod={addUpdatableMod}
                             factorioVersion={factorioVersion}
                             disabled={disabled}
                        />
                )
            }
            </tbody>
        </table>
    )
}

export default ModList;