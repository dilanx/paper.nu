import React from 'react';
import SearchClass from './SearchClass';
import AddButtons from './AddButtons';
import CourseManager from '../../CourseManager';
import {
    SearchIcon,
    ArrowRightIcon,
    DotsHorizontalIcon,
    CollectionIcon,
    ExternalLinkIcon,
} from '@heroicons/react/outline';
import { XCircleIcon } from '@heroicons/react/solid';
import {
    Course,
    PlanData,
    PlanModificationFunctions,
    SearchResultsElements,
    SearchShortcut,
} from '../../types/PlanTypes';
import { UserOptions } from '../../types/BaseTypes';

interface MiniContentBlockProps {
    icon: JSX.Element;
    title: string;
    text: string;
}

function MiniContentBlock(props: MiniContentBlockProps) {
    return (
        <div className="text-center p-4">
            <div className="mx-auto my-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
                {props.icon}
            </div>
            <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
                {props.title}
            </p>
            <p className="text-sm font-light text-gray-400 dark:text-gray-700 leading-relaxed">
                {props.text}
            </p>
        </div>
    );
}

interface SearchProps {
    data: PlanData;
    switches: UserOptions;
    f: PlanModificationFunctions;
}

interface SearchState {
    search: string;
    current?: Course;
    shortcut?: SearchShortcut;
}

class Search extends React.Component<SearchProps, SearchState> {
    searchFieldRef: React.RefObject<HTMLInputElement>;

    constructor(props: SearchProps) {
        super(props);

        this.state = { search: '' };
        this.searchFieldRef = React.createRef();
    }

    searchMessage(title: string, subtitle: string) {
        return (
            <div
                className="text-center text-gray-600 dark:text-gray-400 px-4"
                key="search-message"
            >
                <p className="text-lg font-medium">{title}</p>
                <p className="text-sm font-light">{subtitle}</p>
            </div>
        );
    }

    getResults(): SearchResultsElements {
        let query = this.state.search;

        if (query.length === 0) {
            return {
                results: [
                    <div key="no-query">
                        <MiniContentBlock
                            icon={<SearchIcon className="w-6 h-6" />}
                            title="Be there."
                            text="S̷̤̉̈̓P̴̝̈͒͝A̶̪͕̚C̴͉̬͇͌͝ ̸̤̤̉̒9̶̯̩͔̌̍̚.̴̑̀͜ ̷͙́̿̊S̶͇̥̅͂̒P̷̟̈A̷̲͠C̸̲͓̽͝ͅ ̷͕͎̯̾̄9̷̨͙̜̎̉̊.̸̪̈́ ̵̝̂͗̈́S̵̩͙̥̕P̴̜̤̿̃̐A̸̤̜̍ͅC̴͇̟̬͋͠ ̸̥̀͒̚9̷͎͕̏͐̃.̸̎̈́̕͜ ̴̛̟͉̻̊S̷̘̳̻̾̽͝P̵̨̏Å̵͇̞͕̊C̶̗̟͊̃ ̵̗͗̾9̷̲͉̏̏.̵̣̫͊̅ ̵̺͆̂͜S̶̙̦̾̒̂P̵̫̏̕͝A̸͚͎̟̽C̸̣̟̮͂̏ ̴̧̩͖̌̆9̵͈̩̝̄͝.̶̨̭̅̏͜ ̸͈̂S̶͚͊̔P̶̭̊̐͝A̴̡̯̻̓̈́C̵̜͓͆̃̌ ̶̙̺̘̈́͊̕9̶̛̫̤͖̏̂.̸̢̖̓͗͝ ̶̣̐͗Š̵̹̫̬P̷͈͇̣̕Ą̷̛͖͙C̷̻̔̋ ̶̦̞͗̏͗9̷̗̽ͅ.̷̺̬̒̽ ̶̨͊S̶͖̥̼͊͋P̷̨͚͌̃̋A̶̧̎̽̕C̷̙̦̞͋ ̴̩̭͌9̶̟̓̋͒.̸̰̲̀ ̵̗͇̾͒̑S̴̛̯͑̈P̸̪̩̓A̵̮̿̚C̸̺̪͠ ̸̨̗̀͊͗͜9̵̡̩̾ͅ.̸̀͜ ̸̳̒S̸̮̈͛P̵̨̩̙͌Ǎ̸̬͔͝Ç̶̍̀͆ ̸͍͋9̴̹̀̅.̴̫̼̊̃ ̶͙̾̐̄S̸̳͝P̷̜̮͉͆͝A̷̲̚͝C̴͈̄̍ ̴͚̓9̶̦͂̈͜.̵̠̱͆̀͠ ̵̭͍̃̚S̵̛̰P̸̗̟̥̾͗A̶̩͉͑̐̓C̷̖̙͙̑̋̈́ ̴̳̔̏̄9̶͖̣̗͒͛.̵̣̼̓̀ ̷̙̭̓̃͝S̸̛̺͔P̷̦̓A̸̢̟̥̅̆C̷̩̰͍̄ ̸͓̺͊̒̚9̷̰͉̘̄.̴̦̜̈͌ ̷̧͍̣̍S̸̥̺̒̉͝P̸̼͎̜͠A̷͚̖̎͐̍C̴̤̫̀̿ ̷̺̭̿̓9̶̮͉̎͐͜͠.̶̢̧̼̉̏̎ ̵͍̉́S̴̞̦̑́̒P̸̰̗̣̓̈̓A̷̟͇̐̈́̿C̶͙̱̠̓̑͝ ̵͚͎̪̓9̷͉̒̑.̵̹̒͐̏ ̸̤̥̅̀͘S̷̭͇̜͛͝P̵̩͇̕À̸̘͉͕̊Ċ̷̡̛̾ ̴̘͝9̵͔̑̾.̶̙̓͆ ̴̢̻͓̓̀͝S̷̪̰̀̕P̸͎̝̚Ǎ̷̞̈́C̷͎͗̑͝ ̴̺͔̖̇̎9̴͕̑̌.̸̛͉̭͈ ̴̛͉͙S̷͊̅͜P̶͙̹̃A̷͓̣̥͗̏̓C̸̝̟͌ ̶̬̯̊̊9̶̹̼͕̉.̸̩͗͝ ̵̬͓̻͛S̸̨̢̝͑̎͊P̷͕̝͖̈́́Ḁ̴̯̗̇́͋C̸̨̪͓̒͝ ̵̧͖̍̇9̵̤͠.̷̣͆͜͝ ̴̭̋S̷͙̉͒͆P̸̬̠̿̇Å̶̟͝C̸̢̠̥͌͠ ̶̻͙͙̆͘9̶̨̲̞̇.̶̱͑͂̍ ̵̡̊S̴͔͕͌͐Ṗ̸͍̺̻͛̈A̴̢̛̟͐͘C̴̲̮͋̀̅ͅ ̵͙̥͂͆̃9̵͇̤̱͊̓͝.̶̢̬̫̾ ̸̻̿̈́S̸̯͇̫̊̔͝P̴̣̺̩̊Ä̴̪̘̊C̸̡̻̒̽̈́ ̴̬̒̆͠9̷̡̙͂.̷͕̤̺͆ ̸̻͇͔͠S̸̠͖̆P̸̪͎̤̅A̶̢̹̒́́C̵̢̮͔̍ ̸̫̤̃͑͝9̷̧̧̬̊.̴̗̈́͝ ̸̗̈́S̶̠̈́́P̷̨̲̈́͐A̴̻͙͂̃Č̴̹̌ ̸̤̅̇̿9̶̧̰͒̌ͅ.̶̡̭̅͊͗ ̶͙͆͝Ș̸͖͚̌͒P̵̼̈́A̵̰̓͘C̶͚̘̤̃̈́ ̴̣̟͛̍9̷̻́̔͗.̵͓̲̇̊̍ ̵̢̤͊́͠S̷̺̾̄͘P̷̝̀̌A̷̗͂́C̴͙̲̹̓ ̸̭̣̄ͅ9̵̫̙̃ͅ.̶̟̮͌ ̷̘̳̠̎͘S̴̢͌̈́P̴̟̯̽̎Ä̷̝͈Ċ̴̪̭ ̵̛̾͜9̶͉͙̘́͐̐.̵̠̹͖͋ ̸͕͇̓̂̄Ś̵̡̙̺P̸̡̑Ă̸̰̩̇C̷̪͈̃͋͝ ̶͙͓͝9̷̨̿.̵̺̉̂͝ ̸̩̱͈̾̈̃Ş̷̟͎̐̏P̷̤̯͝A̷͖͂Ċ̵̨͔̘ ̷̻̻̀9̴͕̫̎̔̍͜.̶͓̟͆͝"
                        />
                        <MiniContentBlock
                            icon={<ArrowRightIcon className="w-6 h-6" />}
                            title="Be there."
                            text="Ṡ̷̙̩͝P̴̛͔͆Ȧ̵͕̦C̸̱͚̔̎͐ͅ ̵̖͋͝9̴̨̊͂̓.̶͎̠̀́̃ ̴̖̲̖̆S̶̪̋̆̆P̷̤͓͚̀Â̸̬̊̅C̶̢̲̏̓͘ ̶̣̒͠9̴͖̥̦̿.̷͚̈́̓͆ ̸͍̦͔̄S̷̝̿Ṗ̵̻̼̇̎A̶̡̬̐̽͌Ć̸̨̗̯ ̷͔̝̥͑͘9̸̜̦̚̚.̵͖̱͚̍̇ ̸̟̈́S̷̡͈̥͗̎̚Ṕ̸̤͍̃͝A̴̙̦̤̍͆͝C̶̟͕̪̆̋͆ ̸͎͔̂͑̑9̸̢̛.̷̺̾ ̷̱̂Ś̸̢̻̯P̸̹̤̞̈́̃A̴͉̯͕̚C̴̩͗͌̉ ̴̛͉̤̈͋9̷̦̓̔̈́.̷͉̻̐́ͅ ̸̥̻̭̈͑̀S̴͍͌̚P̸̞̹̿̋ͅA̶̯͑Č̶̛̹̚ ̸̬̆̎9̴̮̘̔.̴̯̥̊ ̶̪̖͂͑ͅS̵̱̳̥͛́̾P̶̪͕͎͋̂A̸̺͘ͅC̸͔͋̃ ̸̮͍̫̑9̸͎̆͌̓.̴̐̈ͅ ̸̆͋͗ͅS̷̬̀́P̵͉̃̆̕A̷̡̘̾̓͛C̴͓̳̘̐ ̷͉̂͜͠9̴̙̗͗͘.̸͉̍̄ ̴̗̊S̸͍̜̳͆͆͑P̸̲̉A̵͉̖̿̈Ć̸̢̼̀ ̵͎̜̏͊̎9̷̘̼͇̓͒.̵͖͑ ̷̦̻͖͒͐S̷̭̔̎̓P̷̗̥̈́̃A̶̡̬̺̎͐͌C̴̳̙͘ ̵͔̍͒͝9̶͖͒͊.̸̻͒͘ ̸̲͖̂͘S̷̰͊P̶̡̻̖͐̾͝A̵͚͆͗̆C̴̟̟͂͂̂ ̴͇̺̎̂͜9̷̰̳̃̆.̷̪̖͉̇̉ ̸̗͎̼͗̌S̷̢͓̱͝P̶̧̡̙̽Ạ̸̔C̴̭̈́ͅ ̵̢̦͊͌͜9̸̗̃.̵̫̅ ̷̞̥̒S̸̙͂͌P̷͈̟͚͐͘Ā̵̜̏̕C̴̥̮̦̕͠ ̴̹͛͝9̴̲̬̤̀.̶͍͚̒ ̵̲̭͊S̶̮̟̆̕P̴̥͎͌̔̈́A̶̜͎͈̒̀C̸̳̐̅̂ ̷̛͙̠9̴͉͔̤̀͑͝.̴̙̠̩́̌̕ ̷̙́͑̎Ş̷̐͊P̵̥̽A̸̢̦͉͝C̴͎̹̈͜ ̷͕͆͂ͅ9̶̼̰̀̋͆.̴̡̦̀ ̸̨͂͐S̸̹͉̐̃ͅP̷̞̼͚̃̓͊Ã̸̟̭̃̚C̶̨̹̈́ ̸̡͍̼̌̆9̶̗͒́͠.̶̧̟̗̇̿"
                        />
                        <MiniContentBlock
                            icon={<CollectionIcon className="w-6 h-6" />}
                            title="Be there."
                            text="S̶̭̮̤̾̊͐P̷̨̦̓͌̑ͅÁ̷̠̥C̷̰͠ ̷̤͗̓̊9̷̡̠͇̔.̷͚̬͑́͑ ̵̲͠S̵̛̳̑̐P̴͙͛̉͠Ä̷̩͛̕Ć̷̗͘ ̴̫̝͈͂9̷̨̘̀̈́̿.̴̰̌̊̾ ̷͕̩͒͐̿Ş̶͓͊͋͠P̸͍̈́͜ͅÅ̴̞͈͚C̴̹͒ ̶̣̅͊9̸̬͠.̵̙̳̋ ̵͕͇̗͠S̵̛̗̲̊̈P̴̛͉͈̐Ä̸̹̯̘C̴̬̩͉̓ ̴̧̭̊͒̕9̴̯̜͔̄.̸̨̋̑ ̵̙͘S̷̠͗̊̚P̴̭̿̐Ą̵͔͕̒̍C̶̥̺̰̍̕ ̸̙̬́9̸̞̔͠.̷͕͚̯͆̽͘ ̵͚̎̍S̴͈̘̆̃͌P̶̙̲̞͛͑̄À̴̮̲͈C̷̬̤͇̓͌̐ ̵̜̭̌́9̵̂ͅ.̶̨̠̾̋ ̸̛̰̙̋͝S̴̙̖̾P̵͓̱͋͊͛ͅA̶͔̦̝͋C̸̢̨̈͒͑ ̴̮̭̾̀9̴̫̟̏.̸͎̪̹̒ ̴̯̮͈̐S̷̯̺͛̅P̷͓͖͕̆̿̚A̶̺̓͘Ċ̶̩̙͇́ ̴͖̟̒9̵̛̫̮̣.̶̛̟̏ ̶͉̆͠͠S̴̱̹̿P̸̢͇̗̾̐̅A̸̲̦̯͛C̶̨͚̫̈́͌ ̵̝̌͘9̴̤͋.̷̨̥̩̈ ̶̖̩͈̽͂S̷̙̣͈̅̚P̷̣͠A̸̼̯̱̽̉C̴̲̣̏͒ ̶͙̿9̸͇͈͈͂.̸̲̈ ̷̗͌͛͝S̴̫̭̊̐P̴̝̩̏̀A̴͖̽͒C̶̝̔̊̎ ̸̫̗̈́͑͑9̴̰͆.̸̯̲̖̌͒ ̶̘̜̩͐S̵̥͓̾̂P̸̢͔̬̽̃̿Å̵̫̅͜C̴̬̓̄ ̴͉͈̮̉̕9̶̛̩̜̾.̷͉̘͋ ̸̡͇̤͝S̸͔̘̲̊̚P̸͉̪͘A̵̱̅̐̀͜C̷̡̮̫̓̿̕ ̴̜̼̜̆̑͝9̵̦̣̾.̶̪̦̒̈́͘ ̵͖̉̎S̶̢̨̿̒͠P̴̯͆̌A̵̱̼̩͊̎C̷̬̲͉͛ ̷͔̥̮̄̿̋9̵̮́͋.̶͎͍̓̾̀ ̵̖͓̹͊̂̕S̶̱̓͐̓P̵̰̖͔͆̍Å̸͍̼̱̀C̷̹̗̰̆̏ ̴͈̳͇̈́9̶̢̧̩̿̌͝.̸͖̹͚͋͐̽ ̶̢̠̑̊̍S̸̖̜̲̐P̷̗̎̑Ä̴̦́̔͘C̵̹̀̒͠ ̷̖̯̈́9̸͕̗͈̊.̵̡̺͖͋ ̵̙̑Ş̵͚̃P̷̙̓̂͌Ạ̵͝Ć̸̦̅ ̵̧̬͑͑̇9̵̭̬̥̎̚.̷͕̒ ̸̙̒S̴͔̥͆̆͘P̵̯̲͇͛͘Á̵͕̬͔C̴̢̭̞͂ ̷̛͎̃͝9̴̼̰̟̽̆̒.̴̲̫͐ ̷̥̼͕͂̓S̵̭̭̱̽̔̄Ṕ̵̱̇Â̷̖̗̊C̷͕͋͛ ̸̛̣͓̘̂9̸̩̻̓͠.̴̻͎̄̾̀ ̵͙̺̘̕S̸̪͊̃P̷͓̏́͜A̸̛͉͌̈C̴̤̄̅ ̴̺͔͛͜9̸̨̛̺̘.̶̙̫́͌ͅ ̶̮͆̀S̸̨̭̊̌Ṕ̵̲̺̔A̴̳̍̈̐C̴͎̤̊̕͝ ̷̧̠̊9̴͉̀͐̈́.̷̟̟̓͝ͅ ̴̙̱̓̀Ș̴̡̢̓͆P̵̯̗͈͋͊A̵̘͒͒̈C̸͎̔ ̸̦̾̈̊9̵̫͂̇.̸̙̹̹̎̆̑"
                        />
                        <MiniContentBlock
                            icon={<ExternalLinkIcon className="w-6 h-6" />}
                            title="Be there."
                            text="S̵̥̆P̴͔͍̿Ä̸̺́̒C̶͕͒̓ͅ ̸̜̬̇̐9̶̙͝.̶̝̈̽̉͜ ̵̨̗̿S̶̖͐͠͠P̸̲̫͉̈A̷̼̅C̸̟͝ ̵̧͉̟́͋͘9̶̦̂.̵̘̰̓͂̃ ̸̬͖͋̑́S̵̤̭͊̉͝P̷̹̈́̓̕A̸̼͗̒C̶̝̬̭̈̿̀ ̸͖̺̾͂9̸̥̚.̴̼̿ ̸̨̦̓Ŝ̵̢̟P̸̪̈́A̸̠̒͗̕C̷͈̼̑̌ ̷̣̾̾͝9̷̡̥̞͐͆.̴̨̘̗̑̉́ ̷͎̞̯̓͑͒S̴̗͛̅P̶̺͔͖͂͆A̷͖̱̰̓͋͝C̷̩͑̚ ̶͖̟̐͆͠9̷̻̑͋͝.̷̪͇̀̌ ̶͖̱̒͊͝S̸̝̼̎̚P̵̦̲̲͂͒͒A̷̯̟͝C̷͖͛ ̷̭̲̠̀͗̓9̷͔͘͝.̶͔̈́́ ̶̝̓͒͗S̶̭̺͕̈̊P̴͙͗À̷̱̋̈́C̸̜̖̳͛̇͘ ̸͇̓̄9̵̟̗̘͒.̷̯̻̈́́͝ ̶̪͎͐̍́S̷͔̥̑͆͝P̴̛̦̟͘A̶̡͓̖͂̄͑C̴̢͙̒͝ ̶̰͗̎ͅ9̷̱͓͗.̴͓̐ ̴̛̞̭͉̏S̵̰̺̀̇͝P̶̦̪̪͋͗̽Ą̷̆C̸̝̔ ̸͍̏̒̒͜9̵̮̻̀̄.̷͓͐͐͂͜ ̸̨̅́S̴̭͇̓P̷͎̿Ä̶̲̀C̵̛͒͜ ̵̘̖̙̑̅͒9̶̨̧͆.̷͚̱͍̆ ̴̨̄S̷̲̲̓P̵̘͎͗A̶̳̰̤͑C̵̭͎̿̀ ̴̡͇͖̓̍̔9̷̙̺̬̊.̴̩͔̓ ̷̘̭̙̊̅S̵̛̥͒̔P̸̛͕̽A̷̠̙̐̄͛C̶̮͑͠ ̴̺̲̝̀9̸̗̓.̷̥̙̆̈́̚ ̷̟̭͆̚S̴̩̈́̃͒P̷̨͎̖̀A̷̝̳͕̅̍̚Ċ̸̻̥̖͝ ̴͙͕͝9̶̙̐͠.̷͍͎̎̈͆ ̵̧̫̽̇S̴̯̆̐P̴͔̜̔̑̍Ā̴͙͎̰C̴̳̊̚ ̸̗̟̟̾̏̓9̸͉̖̿͝.̴̧̮͔͊ ̵̮̟͆͆̔S̵̜̣̃̏P̷͚̭̪̉Á̵̝͚́C̷̮͛͝ͅ ̸̼̩̋̈͒9̶̪̇.̵̥̿ ̶̞͆̉́S̶̛͓̲P̸̛͎̣͋̉À̵̪̱͛C̴̗͐̈ ̸̢͔̋͝9̴̠̅.̶͔̂ ̵̳͖̋S̷͓͎̝̀P̶̜̱̽͝ͅĄ̵̖̈́́͝C̵̝̦̮͆̇͂ ̸̣̠̽͠9̸̑̀̚ͅ.̵̮͎̦͝ ̵̺̖̺̊̑͒S̴̡̜̣̐͐͛P̴̨̫̠̔́A̶̠͙͂C̷͔̤͕̍͝ ̶̰͙̿̕͜9̶̩́̊͝.̸̻̈͝͝ ̸̧̹͗S̴̯̚P̶̪͙̽͌A̸̼̋ͅC̶̗͂͛ ̶̫̚͝9̷͈̓̎.̷͕͎̉̆ ̴͕́Ş̸̤̖͐̒̍P̶̡̠̍̇͝A̴̠̓̉̈́C̷̯͈̎͊́ ̴͔̽̂9̷̧͙̅̕͘.̵̺̈͠ ̸͍̊͂̚S̶̢̈́̿͆P̶̦̾Ă̴̤̟͕͝Ĉ̷̫̖ ̷̥̓9̴̩͈̈̀.̷̯̟̓͋͘ ̴͓̠̬͗S̸̺̖͐͂P̵͉̖̀A̸͓͊̒̕͜C̸̖͍̰͊ ̶̩̾͂9̴̮̕.̸̝̝̅́͠ ̴̮̅̐͠S̷̪̋̂P̷̫̣̓̓͠A̸̧̗̐̽͂C̵̈́̃̈͜ ̶̟̂9̸͚̏͜.̸͚̜̱̌̏͝ ̵̗̣͋̉͌Ś̸̲͇̏P̶̨̣̤̎͌A̷͔͆̀̃C̷̢͉̏̽ ̷̗͚͌9̸̤͖̺̊̎̏.̴͚̮͆̀͝ ̸̮̔̈́̓S̸̰͔̐́̊P̷͖̝̞͆̄͂A̷̱̗͖͛̉͠C̷͕̳̅ ̷̲͇̠͊͐̕9̷̞̈̊̕.̸͙̻̗̃͊̌ ̷̫̫͌̓S̶̨̎̈̑P̸̯̜͈̀̅A̸̰͛̕C̷̹̝̳͂ ̷͚̇ͅ9̸̘̬̎̉.̷̲̎̏͘ͅ ̸͙̋͜S̸̗̬̠̏̿͑P̵̱̻͂́̔A̷̗̱͛̊C̵̻͚̒̚ ̶̡̢̻͒͝9̸͙̉.̸̢̣̎̉͒ ̶͎͕̹̀̃S̸͎͓̞͐̑͂P̷̨̬̩͗̏͝A̶͚̝͊͛̀C̷̭̗͈͆ ̶̹̫̩̀͊͆9̴̫̞͒.̷̮̋ ̶͈̈͘S̷̥̃̓̅P̵̻̠̌A̵̮͚͎̋C̴̡̛̻͇͂́ ̷͕́9̵̣̞̣͐.̴̛̬̾́ ̶̪͎͊̾͂S̴̰̺͎͗͌͒P̴̡̲̰̊Ḁ̴̹̈́̾̉C̷̀͜ ̶̗̌̓̀ͅ9̸̱̞̒̌.̵̘̗̹͆"
                        />
                    </div>,
                ],
            };
        }

        let results = CourseManager.search(query);
        if (results === 'too_short') {
            return {
                results: [
                    this.searchMessage(
                        'Keep typing...',
                        `You'll need at least 3 characters.`
                    ),
                ],
            };
        }

        if (results === 'no_results') {
            return {
                results: [
                    this.searchMessage(
                        'Aw, no results.',
                        `Try refining your search.`
                    ),
                ],
            };
        }

        let courseList = [];
        for (let course of results.results) {
            courseList.push(
                <SearchClass
                    course={course}
                    color={CourseManager.getCourseColor(course.id)}
                    select={(course) => {
                        this.setState({ current: course });
                    }}
                    bookmarks={this.props.data.bookmarks}
                    f={this.props.f}
                    key={course.id}
                />
            );
        }

        if (results.limitExceeded) {
            courseList.push(
                <MiniContentBlock
                    icon={<DotsHorizontalIcon className="w-6 h-6" />}
                    title={`and ${results.limitExceeded} more.`}
                    text="There are too many results to display. You'll need to narrow your search to get more."
                    key="too-many"
                />
            );
        }

        return {
            results: courseList,
            shortcut: results.shortcut,
        };
    }

    render() {
        let singleClassView = false;
        let search = this.state.search;

        let { results, shortcut } = this.getResults();

        let searchField = (
            <div className="sticky top-0 p-2 mb-2 bg-white dark:bg-black z-10 rounded-lg">
                <div className="block mt-4 mb-2 mx-auto w-11/12 relative">
                    <input
                        className="w-full bg-white dark:bg-black border-2 border-gray-300 dark:border-gray-700 shadow-md
                            rounded-lg outline-none hover:border-gray-500 focus:border-black dark:hover:border-gray-400 dark:focus:border-white text-lg p-2 px-4
                            transition-all duration-150 text-black dark:text-white"
                        ref={this.searchFieldRef}
                        value={search}
                        placeholder="Search for classes..."
                        onChange={(event) => {
                            this.setState({ search: event.target.value });
                        }}
                    />
                    {search.length > 0 && (
                        <button
                            className="block absolute right-4 top-0 bottom-0 my-2 text-gray-300 hover:text-red-400 focus:text-red-300 
                            dark:text-gray-600 dark:hover:text-red-400 dark:focus:text-red-500 transition-colors duration-150"
                            onClick={() => {
                                this.setState({ search: '' });
                                this.searchFieldRef.current?.focus();
                            }}
                        >
                            <XCircleIcon className="w-5 h-5" />
                        </button>
                    )}
                </div>
                {shortcut && (
                    <p className="text-center text-sm m-0 p-0 text-gray-500 dark:text-gray-400">
                        replacing{' '}
                        <span className="text-black dark:text-white font-medium">
                            {shortcut.replacing}
                        </span>{' '}
                        with{' '}
                        <span className="text-black dark:text-white font-medium">
                            {shortcut.with}
                        </span>
                    </p>
                )}
            </div>
        );

        let selectedClass = null;
        let addButtons = null;
        let bookmarksButtons = null;
        let exitButton = null;

        let current = this.state.current;
        if (current) {
            singleClassView = true;

            selectedClass = (
                <SearchClass
                    course={current}
                    color={CourseManager.getCourseColor(current.id)}
                />
            );

            addButtons = (
                <AddButtons
                    action={(year, quarter) => {
                        if (current) {
                            this.props.f.addCourse(current, { year, quarter });
                            this.setState({ current: undefined });
                        }
                    }}
                    courses={this.props.data.courses}
                />
            );

            let bookmarks = this.props.data.bookmarks;

            bookmarksButtons = (
                <div className="py-2">
                    <p className="text-center text-gray-500 font-bold p-2 text-sm">
                        MY LIST
                    </p>
                    <button
                        className="block mx-auto bg-indigo-500 text-white font-medium w-4/5 p-0.5 my-2 opacity-100 hover:opacity-60
                            transition-all duration-150 rounded-md shadow-sm"
                        onClick={() => {
                            if (!current) return;
                            if (bookmarks.noCredit.has(current)) {
                                this.props.f.removeBookmark(current, false);
                            } else {
                                this.props.f.addBookmark(current, false);
                            }
                        }}
                    >
                        {bookmarks.noCredit.has(current)
                            ? 'Remove from bookmarks'
                            : 'Add to bookmarks'}
                    </button>
                    <button
                        className="block mx-auto bg-indigo-800 dark:bg-indigo-400 text-white font-medium w-4/5 p-0.5 my-2 opacity-100 hover:opacity-60
                            transition-all duration-150 rounded-md shadow-sm"
                        onClick={() => {
                            if (!current) return;
                            if (bookmarks.forCredit.has(current)) {
                                this.props.f.removeBookmark(current, true);
                            } else {
                                this.props.f.addBookmark(current, true);
                            }
                        }}
                    >
                        {bookmarks.forCredit.has(current)
                            ? 'Remove for credit'
                            : 'Add for credit'}
                    </button>
                </div>
            );

            exitButton = (
                <button
                    className="block mx-auto my-8 bg-gray-500 text-white font-medium
                        w-4/5 p-2 opacity-100 hover:opacity-60 transition-all duration-150 rounded-md shadow-sm"
                    onClick={() => {
                        this.setState({ current: undefined });
                    }}
                >
                    Back
                </button>
            );
        }

        return (
            <div
                className={`${
                    this.props.switches.get.tab === 'Search' ? '' : 'hidden '
                }border-4 border-gray-400 dark:border-gray-800 my-2 rounded-lg shadow-lg h-full
                overflow-y-scroll no-scrollbar`}
            >
                {!singleClassView && searchField}
                {!singleClassView && results}

                {singleClassView && selectedClass}
                {singleClassView && addButtons}
                {singleClassView && bookmarksButtons}
                {singleClassView && exitButton}
            </div>
        );
    }
}

export default Search;
