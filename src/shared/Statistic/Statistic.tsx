import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks/redux';
import { LogoPomodor } from '../icons/LogoPomodor';
import { StatCard } from './StatCard';
import { WeekChart } from './WeekChart';
import { WeekChoice } from './WeekChoice';
import { setRenderWeek, workDay } from '../../store/statisticSlice';
import './statistic.scss';

const emptyDay = {
  pomodor: 0,
  workTime: 0,
  stopCount: 0,
  timeOnPause: 0,
};

const dayNames = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота',]

export function Statistic() {
  const [week, setWeek] = useState<0 | -1 | -2>(0);
  const [weeksStat, setWeeksStat] = useState<workDay[]>([]);
  const [nowDate] = useState(new Date().getTime());
  const [showDay, setShowDay] = useState<workDay>({ date: new Date().getTime(), ...emptyDay });
  // const [renderWeek, setRenderWeek] = useState<workDay[]>([])
  const { statistic } = useAppSelector(state => state.statisticReducer);

  const dispatch = useAppDispatch();

  useEffect(() => {
// console.log(statistic);

    let nowWeekDay = new Date().getDay();
    nowWeekDay = (nowWeekDay != 0 ? nowWeekDay : 7) + 14;

    const result: workDay[] = [];

    for (let weekDay = 1; weekDay <= 21; weekDay++) {
      const tempDate = new Date(nowDate + (weekDay - nowWeekDay) * 24 * 60 * 60 * 1000);

      if (weekDay <= nowWeekDay) {
        const tempMonth = tempDate.getMonth();
        const tempMonthDay = tempDate.getDate();

        const dayStat = statistic.filter((day) =>
          new Date(day.date).getMonth() == tempMonth &&
          new Date(day.date).getDate() == tempMonthDay
        )

        if (dayStat.length > 0) {
          result.push(...dayStat);
        } else {
          result.push({
            date: tempDate.getTime(),
            ...emptyDay
          })
        }
      } else {
        result.push({
          date: tempDate.getTime(),
          ...emptyDay
        })
      }
    }

    setWeeksStat([...result]);
  }, [statistic]);

  useEffect(() => {
    if (week == 0) {
      // setRenderWeek();
      dispatch(setRenderWeek(weeksStat.slice(-7)))
    }
    if (week == -1) {
      // setRenderWeek(weeksStat.slice(7, 14))
      dispatch(setRenderWeek(weeksStat.slice(7, 14)))
    }
    if (week == -2) {
      // setRenderWeek(weeksStat.slice(0, 7))
      dispatch(setRenderWeek(weeksStat.slice(0, 7)))
    }
  }, [weeksStat, week]);

  const handleClickThisDay = (getTimeDate: number) => {

    const [showThisDay] = weeksStat.filter(day =>
      new Date(day.date).getMonth() ==
      new Date(getTimeDate).getMonth()
      &&
      new Date(day.date).getDate() ==
      new Date(getTimeDate).getDate()
    )

    setShowDay(showThisDay);
  }

  return (
    <div className="statistic">
      <div className="statistic__head">
        <h1 className="statistic__h1 h1">
          Ваша активность
        </h1>

        <WeekChoice changeWeek={setWeek} week={week} />
      </div>

      <div className="statistic__body">
        <div className="statistic__top">
          <div className="statistic__day-info">
            <div className="statistic__day">
              <h2 className="statistic__h2 h1">
                {showDay.date &&
                  dayNames[new Date(showDay.date).getDay()]
                }

              </h2>

              <p className="statistic__day-text">
                {showDay.date &&
                  <>
                    Вы работали над задачами в течении <strong> {Math.floor(showDay.workTime)}  минут

                      {Number(Math.floor(showDay.workTime).toString().slice(-1)) == 1 &&
                        <>ы</>
                      }
                    </strong>
                  </>
                }

              </p>
            </div>

            <div className="statistic__pomodor">
              <span className="statistic__pomodor-count">
                <LogoPomodor /> х
                {showDay.pomodor &&
                  showDay.pomodor
                }
              </span>
              <span className="statistic__pomodor-text">
                {showDay.pomodor &&
                  showDay.pomodor
                } помидор

                {Number(showDay.pomodor.toString().slice(-1)) < 5 &&
                  Number(showDay.pomodor.toString().slice(-1)) > 1 &&
                  <>a</>
                }

              </span>
            </div>
          </div>

          {/* <WeekChart weekStat={weekStat}/> */}

          <WeekChart
            handleClickThisDay={handleClickThisDay}
            activeDay={new Date(showDay.date).getDay()}
          />
        </div>

        <div className="statistic__bottom">
          <StatCard mode={'focus'} value={showDay.pomodor != 0 ? Math.floor((showDay.pomodor / 25) * 100 / showDay.pomodor) : 0} />
          <StatCard mode={'time-on-pause'} value={Math.floor(showDay.timeOnPause)} />
          <StatCard mode={'pause-count'} value={showDay.stopCount} />
        </div>
      </div>

    </div>
  );
}
