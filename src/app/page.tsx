"use client";

// React
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";

// Types
import { SurveyResponse } from "./types/survey-response";

export default function Home() {
  const [surveyResponses, setsurveyResponses] = useState<SurveyResponse[]>([]);
  const [ratingMin, setRatingMin] = useState<number | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Set the rating_min value for the API
  const handleChangeRating = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setRatingMin(value === "" ? undefined : parseInt(value));
  }

  // Apply filter on click
  const handleFilterData = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    // Client-side validation: avoids a needless API call. The server validates too (defense in depth).
    const invalidRatingMin = ratingMin === undefined || isNaN(ratingMin) || ratingMin < 1 || ratingMin > 5;

    if (invalidRatingMin) {
      setErrorMessage("La valeur pour la note minimale doit être un chiffre compris entre 1 et 5.");
      return;
    }

    setErrorMessage(null);
    // Pass the value as an argument rather than reading state right after setState (which is async and would not be the good value).
    getSurveyResponses(ratingMin);
  }

  // Reset value on click
  const handleReset = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setRatingMin(undefined);
    getSurveyResponses();
  }
  
  // Fetching survey response from API
  const getSurveyResponses  = async (min?: number) => {      
      try {
        const url = min !== undefined && !isNaN(min) ? `http://localhost:5000/responses?rating_min=${min}` : "http://localhost:5000/responses"
        const data = await fetch(url);

        // fetch does NOT throw on HTTP error statuses (400, 500...): we must check data.ok separately.
        if (!data.ok) {
          const errorBody = await data.json();
          console.error("Erreur API : ", errorBody.error);
          setErrorMessage("La valeur pour la note minimale doit être un chiffre compris entre 1 et 5.");
          return;
        }

        const response: SurveyResponse[] = await data.json();
        setErrorMessage(null);
        setsurveyResponses(response);

        // The catch only handles network errors (server unreachable) or an unreadable response.
      } catch (error) {
        console.error("Erreur lors de la récupération des réponses.", error);
        setErrorMessage("Impossible de contacter le serveur. Veuillez réessayer plus tard.");
      }
  }

  useEffect(() => {
    getSurveyResponses();
  }
  , [])

  // Style for rating
  const ratingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600";
    if (rating <= 2) return "text-red-600";
    return "text-yellow-500"
  }

  return (
    <div className="w-full lg:w-2/3">
      <main className="w-full">
        <h1 className="text-4xl text-blue-900 text-center font-semibold">Tableau des réponses d’enquêtes de satisfaction</h1>
        <div className="flex gap-10 mt-8 sm:items-end sm:flex-row flex-col">
          <div className="mt-5 flex flex-col gap-y-1">
            <label htmlFor="rate-limit" className="text-sm">Note minimale</label>
            <input id="rate-limit" name="rate-limit" className="w-24 rounded-md border border-gray-300 bg-white py-2.5 px-4.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all duration-300 ease-out shadow-md" type="number" min={1} max={5} onChange={handleChangeRating} value={ratingMin ?? ""} />
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleFilterData}
              className="py-2.5 px-4.5 bg-blue-600 rounded-lg text-white hover:bg-blue-700 cursor-pointer active:bg-blue-600 active:ring-1 active:ring-blue-700 transition-all duration-300 ease-out disabled:opacity-50 disabled:bg-blue-600 disabled:ring-0 disabled:cursor-not-allowed shadow-md"
              >
                Filtrer
            </button>
            <button
              onClick={handleReset}
              className="py-2.5 px-4.5 bg-slate-600 rounded-lg text-white hover:bg-slate-700 cursor-pointer active:bg-slate-600 active:ring-1 active:ring-slate-700 transition-all duration-300 ease-out disabled:opacity-50 disabled:bg-slate-600 disabled:ring-0 disabled:cursor-not-allowed shadow-md"
              >
                Réinitialiser
            </button>
          </div>
        </div>
        
        {errorMessage ? 
          <div className="px-8 py-4 bg-red-200 mt-8 rounded-lg text-red-600 shadow-md">
            <p className="">{errorMessage}</p>
          </div>
        :
        <>
          <div className="mt-8 shadow-md rounded-lg border overflow-hidden overflow-x-auto">
            <table className="w-full text-left ">
              <thead className="border-b text-center bg-neutral-200">
                <tr>
                  <th scope="col" className="px-6 py-3 font-bold bg-blue-900 text-white">Date</th>
                  <th scope="col" className="px-6 py-3 font-bold bg-blue-900 text-white">Client</th>
                  <th scope="col" className="px-6 py-3 font-bold bg-blue-900 text-white">Note</th>
                  <th scope="col" className="px-6 py-3 font-bold bg-blue-900 text-white">Commentaire</th>
                </tr>
              </thead>
              {/* We could add a loader when fetching data */}
              <tbody className="text-center">
                {surveyResponses.map((surveyResponse) => {
                  const readableDate = new Date(surveyResponse.date).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  });

                  return (
                    <tr key={surveyResponse.id} className="even:bg-neutral-200">
                      <td className="px-6 py-3">{readableDate}</td>
                      <td className="px-6 py-3">{surveyResponse.client_name}</td>
                      <td className="px-6 py-3"><span className={`font-semibold ${ratingColor(surveyResponse.rating)}`}>{surveyResponse.rating}</span> / 5</td>
                      <td className="px-6 py-3">{surveyResponse.comment}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="pt-4 border-t mt-8 border-slate-300">Nombre de réponses affichées : <span className="font-bold text-blue-900">{surveyResponses.length}</span></p>
        </>
        }
      </main>
    </div>
  );
}
