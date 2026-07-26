export default function SummaryCard({

    title,

    value,

    color,

}) {

    return (

        <div className={`rounded-xl p-6 shadow text-white ${color}`}>

            <h3 className="text-lg">

                {title}

            </h3>

            <p className="mt-4 text-3xl font-bold">

                {value}

            </p>

        </div>

    );

}