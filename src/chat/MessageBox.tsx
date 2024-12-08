import { Message } from './types';

// Type definition for DiseaseInfo
type DiseaseInfo = {
  predictedDisease?: string;
  precautions?: string;
  otherLikelyDiseases: Record<string, string>;
};

export default function MessageBox({ message }: { message: Message }) {
  
  function extractDiseaseInfo(input: string): DiseaseInfo {
    const diseaseInfo: DiseaseInfo = {
      predictedDisease: undefined,
      precautions: undefined,
      otherLikelyDiseases: {}
    };

    // Extract predicted disease
    const predictedDiseaseMatch = input.match(/Predicted disease:\s*(.*)/);
    diseaseInfo.predictedDisease = predictedDiseaseMatch ? predictedDiseaseMatch[1].split("\n")[0].trim() : undefined;

    // Extract precautions for predicted disease
    const precautionsMatch = input.match(/Precautions for this disease:\s*(.*)/);
    diseaseInfo.precautions = precautionsMatch ? precautionsMatch[1].split("\n")[0].trim() : undefined;

    // Extract other likely diseases and their precautions
    const otherDiseasesSection = input.match(/Other likely diseases and their precautions:\s*(.*)/s);
    if (otherDiseasesSection) {
      const diseasePrecautionPairs = otherDiseasesSection[1].trim().split("\n");
      diseasePrecautionPairs.forEach(pair => {
        const [disease, precautions] = pair.split(":");
        if (disease && precautions) {
          diseaseInfo.otherLikelyDiseases[disease.trim()] = precautions.trim();
        }
      });
    }

    return diseaseInfo;
  }

  const diseaseInfo = message.role === 'zelo' ? extractDiseaseInfo(message.content) : null;

  return (
    <div className="relative w-full">
      {message.role === 'user' && (
        <div className="flex justify-end items-start my-4">
          <div className="w-1/2 text-sm bg-[#EFF6FF] px-5 py-3 rounded-2xl mr-2">
            <p>{message.content}</p>
          </div>
          <div className="rounded-full flex justify-center items-center bg-blue-500 text-xs text-white w-6 h-6">
            R
          </div>
        </div>
      )}

      {message.role === 'zelo' && (
        <div className="flex flex-col w-full items-start">
          <div className="flex w-full">
            <div className="w-1/2 text-sm bg-[#EFF6FF] px-5 py-3 rounded-2xl mr-2">
              {/* <p>{message.content}</p> */}
              
              {diseaseInfo?.predictedDisease && (
                <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
                  <h3 className="font-bold text-lg mb-2">Extracted Information</h3>

                  {diseaseInfo.predictedDisease && (
                    <p><strong>Predicted Disease:</strong> {diseaseInfo.predictedDisease}</p>
                  )}

                  {diseaseInfo.precautions && (
                    <p><strong>Precautions:</strong> {diseaseInfo.precautions}</p>
                  )}

                  {Object.entries(diseaseInfo.otherLikelyDiseases).length > 0 && (
                    <>
                      <h4 className="font-bold mt-2">Other Likely Diseases:</h4>
                      <ul>
                        {Object.entries(diseaseInfo.otherLikelyDiseases).map(([disease, precautions]) => (
                          <li key={disease}><strong>{disease}:</strong> {precautions}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
