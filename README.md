# SF Crime Data
Pull incident reports from SF Open Data

Note: this repository takes advantage of [ZenHub](https://www.zenhub.io/). If you haven't added it to your Github yet, it's recommended to better understand how issues are prioritized.

## Initial Use Case:
Universities and colleges are required by a federal law, [the Jeanne Clery Act](http://clerycenter.org/summary-jeanne-clery-act), to report crime statistics on specific crimes that happened within ~500 feet of anywhere their student population went. The SFPD fields about 2,500 requests per year from universities and colleges for information about those crimes, which take between 20-40 minutes to fulfill... per request, which is about ~156.25 8-hour days. They need to do a radial search around a specific address (or list of addresses), as provided by the universities or colleges.

This application does exactly that. It performs a radial search of variable size around an address provided by the user, and then offers the datapoints (crimes, in this case) for download.

At the moment, the application is 100% browser-based. No servers at all. Just API calls, HTML, CSS, and JavaScript. It's likely that the immediately pending version can stay this way... not necessarily as likely for the "Wouldn't it be cool if..." version.


## Vision (initial versions)
Satisfy SFPD crime reporting needs, as well as other interested parties, including watch dog groups, organizations with reporting requirements (like universities), and civic hackers, while ensuring an easily maintainable product.

## Vision (bigtime, but specific to the Clery Act)
(Note: that this comes after Vision #1 is complete, so the rest of the README doesn't address this vision.)
Create a single place for all universities and colleges in the United States to collect the data for their Clery Act reporting requirements, incorporating data from as many police departments in the country as possible.


##Project Needs
 - **Copywriter!** The site needs more and easily understandable information on it. Zero coding required.
 - **User Researcher!** Can you reach out to a university's crime data reporting team, understand their needs (without biasing them), and take notes as they test this application? Zero coding required.
 - **Front-end developer!** Yup. Self-explanatory if you read the above paragraph. Bonus points if you love APIs and are up for the challenge of keeping the whole project browser-based... even the coming versions.
 - **Future project lead!** If you're interested managing in this project, come check it out asap and get up to speed... then build it out so any police department in the country can use it. **Time savings in the multiple thousands of workdays across the entire U.S.**

##Running Codebase Locally
If you want to download the github repository and run the code locally on your Apple machine,
- open terminal
- go to the folder directory 
- run 'python -m SimpleHTTPServer'

## What's Next?
After speaking with the Crime Data Analysis Unit at the SFPD on 5/6/16 for initial user **research**, the current prototype satisfies their minimum needs. They plan to direct future inquiring universities and colleges directly to [http://sfcrimedata.org]. Great!

However, the prototype has a few things that could be greatly improved (also listed as issues), which were discovered during initial user **testing**. Specifically:
* Columns displayed on the desktop version of the data table are insufficient (posted in an issue)
* Would be great for a "Clery Act"-specific report
* Display the source of the data and when it was last updated


## Wouldn't It Be Cool If...
When prompted to think about other uses for this web app, the SFPD crime data analysts asked for the following:
* Ability to overlay data layers, such as PD district laters, sector layers (police beats), political jurisdictions, plots (9sq block areas), and national/state/local parks. 
* Why? Police captains want to see what is going on in their jurisdiction, cops want to see what happened on their beats while they were off duty, the Mayor's Office wants to know what's going on in a particular area, and SFPD in general wants to know what's going on on their turf (hence the park layer). The Crime Data Analysis Team runs regular (weekly) reports for nearly all of these folks and the team could save even MORE time by sharing this web app with the entire SFPD, who could run their own reports by themselves.
* Ability to see crime data over time (add beginning and ending time period filter).
* Why? Every single captain of every single district (and anyone else who has to report to constituents) wants to know if they're up or down on crime over a specific period of time. 
