import {
  Bars3Icon,
  ChevronDownIcon,
  ChevronUpIcon,
  MinusIcon,
  SunIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import React from 'react';
import {
  ContextMenu,
  ContextMenuData,
  UserOptions,
} from '../../types/BaseTypes';
import {
  BookmarksData,
  Course,
  PlanModificationFunctions,
  PlanSpecialFunctions,
} from '../../types/PlanTypes';
import { SideCard } from '../../types/SideCardTypes';
import Utility from '../../utility/Utility';
import UtilityButton from '../menu/UtilityButton';
import Quarter from './Quarter';
import { Alert } from '../../types/AlertTypes';
import { OpenRatingsFn } from '../../types/RatingTypes';

interface YearProps {
  data: Course[][];
  bookmarks: BookmarksData;
  year: number;
  f: PlanModificationFunctions;
  f2: PlanSpecialFunctions;
  sideCard: SideCard;
  alert: Alert;
  openRatings: OpenRatingsFn;
  contextMenuData?: ContextMenuData;
  contextMenu: ContextMenu;
  switches: UserOptions;
  title: string;
}

interface YearState {
  hidden: boolean;
}

const variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      when: 'beforeChildren',
    },
  },
};

class Year extends React.Component<YearProps, YearState> {
  constructor(props: YearProps) {
    super(props);

    this.state = {
      hidden: false,
    };
  }

  render() {
    let content = this.props.data;

    let quarters: JSX.Element[] = [];
    if (content) {
      quarters = content.map((quarter, index) => {
        let { title, color } = Utility.convertQuarter(index);
        return (
          <Quarter
            data={quarter}
            bookmarks={this.props.bookmarks}
            location={{ year: this.props.year, quarter: index }}
            f={this.props.f}
            sideCard={this.props.sideCard}
            alert={this.props.alert}
            openRatings={this.props.openRatings}
            switches={this.props.switches}
            title={title}
            color={color}
            yearHasSummer={content.length === 4}
            key={this.props.year + '-' + index}
          />
        );
      });
    }

    const menuItems = [
      {
        text: quarters.length < 4 ? 'Add summer' : 'Remove summer',
        icon: SunIcon,
        onClick: () => {
          if (quarters.length < 4) {
            this.props.f2.addSummerQuarter(this.props.year);
          } else {
            this.props.f2.removeSummerQuarter(this.props.year);
          }
        },
      },
      {
        text: 'Clear courses',
        icon: TrashIcon,
        onClick: () => {
          this.props.f2.clearData(this.props.year);
        },
      },
    ];

    if (this.props.year >= 4) {
      menuItems.push({
        text: 'Delete year',
        icon: MinusIcon,
        onClick: () => {
          this.props.f2.removeYear(this.props.year);
        },
      });
    }

    return (
      <motion.div initial="hidden" animate="visible" variants={variants}>
        <div
          className="relative m-5 rounded-xl border-4 border-gray-200 bg-white p-4 shadow-sm transition-all duration-150
                    compact:my-0 compact:border-0 compact:py-2 compact:shadow-none dark:border-gray-700 dark:bg-gray-800"
        >
          <p
            className={`text-center text-2xl font-bold text-gray-300 compact:text-sm compact:text-black dark:text-gray-500 ${
              this.state.hidden ? '' : 'pb-2'
            }`}
          >
            {this.props.title}
          </p>
          {!this.state.hidden && (
            <div
              className={`grid grid-cols-1 gap-12 ${
                quarters.length === 4
                  ? 'lg:grid-cols-4 lg:gap-4'
                  : 'lg:grid-cols-3'
              }`}
            >
              {quarters}
            </div>
          )}
          <div className="absolute right-2 top-1 flex items-center gap-1">
            <UtilityButton
              Icon={this.state.hidden ? ChevronDownIcon : ChevronUpIcon}
              onClick={() => {
                this.setState({
                  hidden: !this.state.hidden,
                });
              }}
            >
              {this.state.hidden ? 'Show' : 'Hide'}
            </UtilityButton>
            <UtilityButton
              Icon={Bars3Icon}
              active={
                this.props.contextMenuData?.name ===
                `year-actions-${this.props.year}`
              }
              onClick={(x, y) => {
                this.props.contextMenu({
                  x: x,
                  y: y,
                  name: `year-actions-${this.props.year}`,
                  items: menuItems,
                });
              }}
            >
              Menu
            </UtilityButton>
          </div>
          {/* <div className="absolute right-1 top-1 text-gray-300 dark:text-gray-500">
            <button
              className="group relative inline-block bg-transparent p-1 hover:text-fuchsia-400 dark:hover:text-fuchsia-400"
              onClick={() => {
                this.setState({
                  hidden: !this.state.hidden,
                });
              }}
            >
              {this.state.hidden ? (
                <ChevronDownIcon className="h-5 w-5" />
              ) : (
                <ChevronUpIcon className="h-5 w-5" />
              )}
              <Tooltip color="fuchsia" className="-bottom-10 right-0 w-40">
                {this.state.hidden
                  ? "Show year's courses"
                  : "Hide year's courses"}
              </Tooltip>
            </button>
            <button
              className={`group relative inline-block bg-transparent p-1 hover:text-purple-400 dark:hover:text-purple-400 ${
                this.props.contextMenuData?.name ===
                `year-actions-${this.props.year}`
                  ? 'text-purple-400'
                  : ''
              }`}
              onClick={(e) => {
                const { x, y, width, height } =
                  e.currentTarget.getBoundingClientRect();

                this.props.contextMenu({
                  x: x + width,
                  y: y + height + 10,
                  name: `year-actions-${this.props.year}`,
                  items: [
                    {
                      text:
                        quarters.length < 4 ? 'Add summer' : 'Remove summer',
                      icon: SunIcon,
                      onClick: () => {
                        if (quarters.length < 4) {
                          this.props.f2.addSummerQuarter(this.props.year);
                        } else {
                          this.props.f2.removeSummerQuarter(this.props.year);
                        }
                      },
                    },
                    {
                      text: 'Clear courses',
                      icon: TrashIcon,
                      onClick: () => {
                        this.props.f2.clearData(this.props.year);
                      },
                    },
                  ],
                });
              }}
            >
              <Bars3Icon className="h-5 w-5" />
              <Tooltip color="purple" className="-bottom-10 right-0">
                Year actions
              </Tooltip>
            </button>
          </div> */}
        </div>
      </motion.div>
    );
  }
}
export default Year;
