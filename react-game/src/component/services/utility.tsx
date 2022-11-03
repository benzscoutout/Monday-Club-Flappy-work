import * as gtag from "./gtag";
import ReactGA from "react-ga4";
export default function UtilityService() {

    return {
        clickSendEvent(event:string, page:string, label: string) {
            gtag.event({
                action: event,
                category: page,
                label: label,
                value: event + " " + page + " " + label
            })
            ReactGA.event({
                category: page,
                action: event,
                label: label, // optional
              });
        }, setPageTitle(title:string){
            ReactGA.send(title);
            gtag.pageview(title);
        }, convertAddress(account: string) {
            const addressConvert = account.substring(0, 2) +
                "......." +
                account.substring(37, account.length);
            return addressConvert;
        }
    }
}