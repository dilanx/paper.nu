import React from 'react';
import { DropTarget } from 'react-dnd';
import Class from '../Class.js';
import CourseManager from '../../CourseManager.js';

const listTarget = {
    drop(props, monitor, component) {
        if (monitor.didDrop()) {
            return;
        }
        const item = monitor.getItem();
        props.addFavorite(item.course, props.credit);
    },
};

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        isOverCurrent: monitor.isOver({ shallow: true }),
        canDrop: monitor.canDrop(),
        itemType: monitor.getItemType(),
    };
}

class FavoritesList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hovered: false,
        };
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.isOver && this.props.isOver) {
            this.setState({ hovered: true });
        }

        if (prevProps.isOver && !this.props.isOver) {
            this.setState({ hovered: false });
        }
    }

    render() {
        let content = this.props.credit
            ? Array.from(this.props.favorites.forCredit)
            : Array.from(this.props.favorites.noCredit);
        let classes = [];
        if (content.length > 0) {
            classes = content.map((classData, index) => {
                return (
                    <Class
                        course={classData}
                        key={index}
                        yi={-1}
                        qi={-1}
                        alert={this.props.alert}
                        switches={this.props.switches}
                        favorites={this.props.favorites}
                        delCourse={() => {
                            this.props.delFavorite(
                                classData,
                                this.props.credit
                            );
                        }}
                        addFavorite={() => {
                            this.props.addFavorite(classData, false);
                        }}
                        delFavorite={() => {
                            this.props.delFavorite(classData, false);
                        }}
                    />
                );
            });
        } else {
            classes = (
                <div
                    className={`text-center col-span-1 ${
                        this.props.credit ? '' : 'lg:col-span-2'
                    } overflow-hidden whitespace-normal`}
                >
                    <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                        {this.props.credit
                            ? `Classes here are counted towards total credit (like classes you've received AP/IB credit for).`
                            : `Find a class you're interested in but don't have a spot for it on your schedule yet? Bookmark it for later by dragging it here.`}
                    </p>
                </div>
            );
        }

        let units = CourseManager.getExtraCredits(content);

        let unitString = 'units';
        if (units === 1) {
            unitString = 'unit';
        }

        const { connectDropTarget } = this.props;
        return connectDropTarget(
            <div
                className={`relative rounded-lg col-span-1 ${
                    this.props.credit ? '' : 'lg:col-span-2'
                } px-8 pt-4 pb-8 border-2
                    ${
                        this.state.hovered
                            ? 'border-dashed border-emerald-500 bg-emerald-300 bg-opacity-50'
                            : `border-solid bg-gray-50 dark:bg-gray-800
                        ${
                            this.props.credit
                                ? 'border-indigo-800 dark:border-indigo-400'
                                : 'border-indigo-500'
                        }`
                    }
                    space-y-3 h-full shadow-lg`}
            >
                <p className="text-center font-bold text-md m-0 p-0 text-gray-600 dark:text-gray-400">
                    {this.props.credit ? 'FOR CREDIT' : 'BOOKMARKED COURSES'}
                </p>
                <div
                    className={`grid grid-cols-1 gap-3 ${
                        this.props.credit ? '' : 'lg:grid-cols-2'
                    }`}
                >
                    {classes}
                </div>
                {this.props.credit && this.props.switches.quarter_units && (
                    <p className="absolute right-2 top-0 text-right text-xs p-0 m-0 text-gray-400 font-normal">
                        <span className="font-medium">{units}</span>{' '}
                        {unitString}
                    </p>
                )}
            </div>
        );
    }
}

export default DropTarget('Class', listTarget, collect)(FavoritesList);
