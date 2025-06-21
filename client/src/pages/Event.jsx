import OngoingEvent from "../components/OngoingEvent"
import UpComingEvent from "../components/UpcomingEventForHome"



const Event = () => {
    return (
        <div className="flex flex-col">
            <div className="">

                <OngoingEvent />
            </div>
            <UpComingEvent />
        </div>
    )
}

export default Event