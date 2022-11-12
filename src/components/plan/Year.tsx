import {
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import React from 'react';
import { UserOptions } from '../../types/BaseTypes';
import {
  BookmarksData,
  Course,
  PlanModificationFunctions,
  PlanSpecialFunctions,
} from '../../types/PlanTypes';
import { SideCard } from '../../types/SideCardTypes';
import Utility from '../../utility/Utility';
import Tooltip from '../generic/Tooltip';
import Quarter from './Quarter';

interface YearProps {
  data: Course[][];
  bookmarks: BookmarksData;
  year: number;
  f: PlanModificationFunctions;
  f2: PlanSpecialFunctions;
  sideCard: SideCard;
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
            switches={this.props.switches}
            title={title}
            color={color}
            yearHasSummer={content.length === 4}
            key={this.props.year + '-' + index}
          />
        );
      });
    }

    return (
      <motion.div initial="hidden" animate="visible" variants={variants}>
        <div
          className="relative p-4 border-4 border-gray-200 dark:border-gray-700 rounded-lg m-5 shadow-sm bg-white dark:bg-gray-800
                    compact:border-0 compact:shadow-none compact:my-0 compact:py-2 transition-all duration-150"
        >
          <p
            className={`text-center text-2xl text-gray-300 font-bold compact:text-sm compact:text-black dark:text-gray-500 ${
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
          <div className="absolute right-1 top-1 text-gray-300 dark:text-gray-500">
            {quarters.length < 4 && (
              <button
                className="inline-block p-1 bg-transparent hover:text-yellow-300 dark:hover:text-yellow-300 relative group"
                onClick={() => {
                  this.props.f2.addSummerQuarter(this.props.year);
                }}
              >
                <PlusIcon className="w-5 h-5" />
                <Tooltip color="yellow" className="-bottom-10 right-0 w-48">
                  Add summer quarter
                </Tooltip>
              </button>
            )}
            <button
              className="inline-block p-1 bg-transparent hover:text-red-400 dark:hover:text-red-400 relative group"
              onClick={() => {
                this.props.f2.clearData(this.props.year);
              }}
            >
              <TrashIcon className="w-5 h-5" />
              <Tooltip color="red" className="-bottom-10 right-0 w-48">
                Clear year's courses
              </Tooltip>
            </button>
            <button
              className="inline-block p-1 bg-transparent hover:text-fuchsia-400 dark:hover:text-fuchsia-400 relative group"
              onClick={() => {
                this.setState({
                  hidden: !this.state.hidden,
                });
              }}
            >
              {this.state.hidden ? (
                <ChevronDownIcon className="w-5 h-5" />
              ) : (
                <ChevronUpIcon className="w-5 h-5" />
              )}
              <Tooltip color="fuchsia" className="-bottom-10 right-0 w-48">
                {this.state.hidden
                  ? "Show year's courses"
                  : "Hide year's courses"}
              </Tooltip>
            </button>
          </div>
        </div>
      </motion.div>
    );
  }
}
export default Year;
