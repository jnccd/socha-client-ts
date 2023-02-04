"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const linq_1 = __importDefault(require("linq"));
const dom_parser_1 = __importDefault(require("dom-parser"));
function welcomePerson(person) {
    console.log(`Hewwo ${person.firstName} ${person.lastName}`);
    return `Hewwo ${person.firstName} ${person.lastName}`;
}
const james = {
    firstName: "<uwu>",
    lastName: "owosen"
};
welcomePerson(james);
console.log(linq_1.default.range(0, 50).where((i) => i % 2 == 1).select((i) => i * 69).toArray());
const parser = new dom_parser_1.default();
const dom = parser.parseFromString(`<li class="ml-0 py-1 d-flex">
<div class="col-8 css-truncate css-truncate-target lh-condensed width-fit flex-auto min-width-0">
  <a data-hovercard-type="repository" data-hovercard-url="/jnccd/socha-client-js/hovercard" data-hydro-click="{&quot;event_type&quot;:&quot;user_profile.click&quot;,&quot;payload&quot;:{&quot;profile_user_id&quot;:19777592,&quot;target&quot;:&quot;TIMELINE_REPO_LINK&quot;,&quot;user_id&quot;:19777592,&quot;originating_url&quot;:&quot;https://github.com/jnccd&quot;}}" data-hydro-click-hmac="6befd676633b1f7125ef9383886d0d68c5c20870b9adb2a34f789768a806d959" href="/jnccd/socha-client-js">jnccd/socha-client-js</a>
  <a class="f6 Link--muted ml-lg-1 mt-1 mt-lg-0 d-block d-lg-inline" data-hydro-click="{&quot;event_type&quot;:&quot;user_profile.click&quot;,&quot;payload&quot;:{&quot;profile_user_id&quot;:19777592,&quot;target&quot;:&quot;TIMELINE_COMMIT_RANGE&quot;,&quot;user_id&quot;:19777592,&quot;originating_url&quot;:&quot;https://github.com/jnccd&quot;}}" data-hydro-click-hmac="144c58658712cbcdf27b0f4efca89891efbf7899002181b37eec56f6982b2191" href="/jnccd/socha-client-js/commits?author=jnccd&amp;since=2022-12-31&amp;until=2023-01-28">
    15 commits
</a>    </div>

<div class="col-3 flex-shrink-0">
  <div class="Progress mt-1 tooltipped tooltipped-n color-bg-default" aria-label="40% of commits in January were made to jnccd/socha-client-js ">
    <span class="Progress-item rounded-2" style="width: 40%;background-color: #40c463"></span>
  </div>
</div>
</li>`);
console.log(dom.getElementsByTagName('div'));
