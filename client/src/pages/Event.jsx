import OngoingEvent from "../components/OngoingEvent"
import UpComingEvent from "../components/UpcomingEvent"



const Event = () => {
    return (
        <div className="flex flex-col">
            <div className="">

                <OngoingEvent />
            </div>
            <div>

                <UpComingEvent />
            </div>
        </div>
    )
}

export default Event