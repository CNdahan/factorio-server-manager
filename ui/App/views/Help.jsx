import Panel from "../components/Panel";
import React from "react";
import {useTranslation} from "react-i18next";

const Help = () => {
    const {t} = useTranslation();
    return (
        <Panel
            title={t('help.title')}
            content={
                <>
                    <h1 className="text-xl text-dirty-white">{t('help.heading')}</h1>
                    <p className="mb-2">{t('help.description')}</p>

                    <h2 className="text-dirty-white">{t('help.bugsHelp')}</h2>
                    <p className="mb-4">{t('help.pleaseUse')} <a className="text-blue hover:text-blue-light" target="_blank" href="https://github.com/OpenFactorioServerManager/factorio-server-manager/issues">{t('help.githubRepo')}</a> {t('help.reportBugs')}</p>

                    <h1 className="mb-1 text-xl text-dirty-white">{t('help.helpfulResources')}</h1>
                    <p className="mb-2"><a className="text-blue hover:text-blue-light" target="_blank" href="https://wiki.factorio.com/Multiplayer">{t('help.officialWiki')}</a></p>
                </>
            }
        />
    )
}

export default Help;