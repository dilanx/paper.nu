import {
  BookmarkIcon,
  CloudIcon,
  Cog6ToothIcon,
  ArrowTopRightOnSquareIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import Account from '../../Account';
import { Alert } from '../../types/AlertTypes';
import {
  Color,
  ColorMap,
  IconElement,
  UserOptions,
} from '../../types/BaseTypes';
import { PlanSpecialFunctions } from '../../types/PlanTypes';
import { Mode } from '../../utility/Constants';
import Tooltip from '../generic/Tooltip';
import settingsMenu from './Settings';
import shareMenu from './Share';
import { TabBar, TabBarButton } from './TabBar';

interface MiniButtonProps {
  icon: IconElement;
  color: Color;
  display: string;
  action: () => void;
}

function MiniButton(props: MiniButtonProps) {
  let color = props.color;
  return (
    <button
      className={`p-1 border-2 border-gray-400 dark:border-gray-500 rounded-lg text-gray-500 dark:text-gray-300
                hover:border-${color}-500 dark:hover:border-${color}-500 hover:bg-${color}-50 dark:hover:bg-gray-800
                hover:text-${color}-500 dark:hover:text-${color}-400 relative group`}
      onClick={() => {
        props.action();
      }}
    >
      <props.icon className="w-5 h-5" />
      <Tooltip color={color} className="-top-10 left-1/2 -translate-x-1/2">
        {props.display}
      </Tooltip>
    </button>
  );
}

const TabBarButtonColors: ColorMap = {
  Search: 'gray',
  'My List': 'indigo',
  Plans: 'rose',
};

interface TaskBarProps {
  openAboutMenu: () => void;
  alert: Alert;
  version: string;
  switches: UserOptions;
  f2: PlanSpecialFunctions;
  tabLoading: boolean;
}

function TaskBar(props: TaskBarProps) {
  const switches = props.switches;
  return (
    <div className="flex mx-auto mt-2 mb-4 gap-2">
      <MiniButton
        icon={InformationCircleIcon}
        color="purple"
        display="About"
        action={() => props.openAboutMenu()}
      />
      <MiniButton
        icon={ArrowTopRightOnSquareIcon}
        color="green"
        display="Share"
        action={() => props.alert(shareMenu())}
      />
      <MiniButton
        icon={Cog6ToothIcon}
        color="yellow"
        display="Settings"
        action={() => props.alert(settingsMenu(props.f2))}
      />
      <TabBar
        switches={props.switches}
        switchName="tab"
        tabLoading={props.tabLoading}
        colorMap={TabBarButtonColors}
      >
        <TabBarButton
          name="Search"
          selected={props.switches.get.tab as string}
          switches={props.switches}
          switchName="tab"
          color={TabBarButtonColors['Search']}
        >
          <MagnifyingGlassIcon className="w-5 h-5" />
        </TabBarButton>
        <TabBarButton
          name="My List"
          selected={props.switches.get.tab as string}
          switches={props.switches}
          switchName="tab"
          color={TabBarButtonColors['My List']}
        >
          <BookmarkIcon className="w-5 h-5" />
        </TabBarButton>
        <TabBarButton
          name="Plans"
          display={switches.get.mode === Mode.PLAN ? 'Plans' : 'Schedules'}
          selected={props.switches.get.tab as string}
          switches={props.switches}
          switchName="tab"
          color={TabBarButtonColors['Plans']}
        >
          <CloudIcon className="w-5 h-5" />
          <p className="lg:hidden xl:block m-0 text-sm lg:text-xs w-20 lg:w-12 overflow-hidden whitespace-nowrap text-ellipsis">
            {switches.get.mode === Mode.SCHEDULE
              ? Account.getScheduleName(switches.get.active_schedule_id)
              : Account.getPlanName(switches.get.active_plan_id)}
          </p>
        </TabBarButton>
      </TabBar>
    </div>
  );
}

export default TaskBar;
