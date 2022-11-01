const test = {
    title: "",
    ga_4: "G-40YMZ2R247",
    ga: "G-40YMZ2R247",
    link_social: {
        discord: "https://mondayclub.page.link/KPoa",
        telegram: "https://t.me/mondayclub",
        twitter: "https://twitter.com/MondayClubHQ",
        facebook: "https://www.facebook.com/MondayClub.io",
        gitbook: "https://mondayclub.gitbook.io/monday-club/",
        gitbook_team: "https://mondayclub.gitbook.io/monday-club/the-formal-stuff/team",
        gitbook_aboutus: "https://mondayclub.gitbook.io/monday-club/the-formal-stuff/team",
        gitbook_avartar: "https://mondayclub.gitbook.io/monday-club/products/avatar",
        gitbook_tokenomic: "https://mondayclub.gitbook.io/monday-club/the-formal-stuff/tokenomics",
        gitbook_roadmap: "https://mondayclub.gitbook.io/monday-club/the-formal-stuff/roadmap"

    },
    firebaseConfig: {
        authDomain: "monday-club-48189.firebaseapp.com",
        projectId: "monday-club-48189",
        storageBucket: "monday-club-48189.appspot.com",
        appId: "1:59628633346:web:2a0c2fa4d80ca1ed87961b",
        measurementId: "G-DM31RQF8RH"
    },
    app: {
        nft: "https://nft.mondayclub.io",
        home: "https://monday-club-test.web.app",
        campaign: "https://monday-club-test.web.app/campaign",
        gallery: "https://monday-club-test.web.app/gallery",
        map: "https://map-monday-club-test.web.app",
        scoutout_service: "https://scoutout.io/scoutout-system",
        launch_app: "https://app.mondayclub.io",
        personality: "https://quiz.mondayclub.io?utm_source=NFT_LANDING",
        opensea_prefix: "https://testnets.opensea.io/assets/rinkeby/0x235f48e5bcda35af115028b94b473677977069ec/"

    },


};


const prod = {
    title: "",
    ga_4: "G-90SSTYG5QZ",
    ga: "G-90SSTYG5QZ",
    link_social: {
        discord: "https://mondayclub.page.link/KPoa",
        telegram: "https://t.me/mondayclub",
        twitter: "https://twitter.com/MondayClubHQ",
        facebook: "https://www.facebook.com/MondayClub.io",
        gitbook: "https://mondayclub.gitbook.io/monday-club/",
        gitbook_team: "https://mondayclub.gitbook.io/monday-club/the-formal-stuff/team",
        gitbook_aboutus: "https://mondayclub.gitbook.io/monday-club/the-formal-stuff/team",
        gitbook_avartar: "https://mondayclub.gitbook.io/monday-club/products/avatar",
        gitbook_tokenomic: "https://mondayclub.gitbook.io/monday-club/the-formal-stuff/tokenomics",
        gitbook_roadmap: "https://mondayclub.gitbook.io/monday-club/the-formal-stuff/roadmap"

    },
    firebaseConfig: {
        authDomain: "monday-club-48189.firebaseapp.com",
        projectId: "monday-club-48189",
        storageBucket: "monday-club-48189.appspot.com",
        appId: "1:59628633346:web:2a0c2fa4d80ca1ed87961b",
        measurementId: "G-DM31RQF8RH"
    },
    app: {
        home: "https://mondayclub.io",
        campaign: "https://mondayclub.io/campaign",
        gallery: "https://mondayclub.io/gallery",
        nft: "https://nft.mondayclub.io",
        map: "https://map.mondayclub.io",
        scoutout_service: "https://scoutout.io/scoutout-system",
        launch_app: "https://app.mondayclub.io",
        personality: "https://quiz.mondayclub.io?utm_source=NFT_LANDING",
        opensea_prefix: "https://opensea.io/assets/ethereum/0x87a84fd1f96904519ab96815f24dfbb95c0d2aae/"

    },
};

const config = process.env.REACT_APP_ENVIRONMENT === 'production'
    ? prod 
    : test;

export default {
    // Add common config values here
    MAX_ATTACHMENT_SIZE: 5000000,
    ...config
};