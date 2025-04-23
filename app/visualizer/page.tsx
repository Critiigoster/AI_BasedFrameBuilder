'use client'

import { useState } from 'react'

// Keywords for validation (add more as needed)
const filmingKeywords = [
  'film', 'shoot', 'shooting', 'video', 'scene', 'camera', 'actor', 'actress', 'podcast', 'interview', 'commercial', 'movie', 
  'зйомка', 'знімати', 'фільм', 'відео', 'сцена', 'камера', 'актор', 'актриса', 'подкаст', 'інтерв\'ю', 'реклама', 'кіно'
];

// Helper function to construct the enhanced prompt
const constructPrompt = (mainPrompt: string, details: Record<string, string>): string => {
  // Add the prefix for a lifelike shot
  let prompt = `Create an ultra-detailed, lifelike shot that showcases: ${mainPrompt}.\n\nDetails based on shoot brief:\n`;
  for (const [key, value] of Object.entries(details)) {
    if (value && value.trim() !== '') {
      const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
      prompt += `- ${formattedKey}: ${value}\n`;
    }
  }
  return prompt.trim();
}

export default function Visualizer() {
  // --- State for Form Inputs ---
  const [mainPrompt, setMainPrompt] = useState('');
  const [projectType, setProjectType] = useState('');
  const [videoTheme, setVideoTheme] = useState('');
  const [videoTone, setVideoTone] = useState('');
  const [colorPalette, setColorPalette] = useState('');
  const [lightingStyle, setLightingStyle] = useState('');
  const [cameraAngles, setCameraAngles] = useState('');
  const [composition, setComposition] = useState('');
  const [moodAtmosphere, setMoodAtmosphere] = useState('');
  const [cameraMovement, setCameraMovement] = useState('');
  const [settingDetails, setSettingDetails] = useState('');
  const [participants, setParticipants] =useState('');
  const [wardrobe, setWardrobe] = useState('');
  const [hairMakeup, setHairMakeup] = useState('');
  const [backgrounds, setBackgrounds] = useState('');

  // --- State for API Interaction ---
  const [isLoading, setIsLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedMainPrompt = mainPrompt.trim();
    
    if (!trimmedMainPrompt) {
        setError('Будь ласка, введіть основний запит для зображення.');
        return;
    }

    // Input validation for filming keywords
    const isFilmingRelated = filmingKeywords.some(keyword => 
      trimmedMainPrompt.toLowerCase().includes(keyword)
    );

    if (!isFilmingRelated) {
      setError('Вкажіть запит, який стосується зйомки');
      setIsLoading(false); // Ensure loading stops
      setImageUrl(null); // Clear any previous image
      return; // Stop execution
    }

    setIsLoading(true)
    setImageUrl(null)
    setError(null)

    const briefDetails = {
        projectType,
        videoTheme,
        videoTone,
        colorPalette,
        lightingStyle,
        cameraAngles,
        composition,
        moodAtmosphere,
        cameraMovement,
        settingDetails,
        participants,
        wardrobe,
        hairMakeup,
        backgrounds,
    };

    const finalPrompt = constructPrompt(trimmedMainPrompt, briefDetails);
    console.log("Generated Prompt:", finalPrompt);
    
    try {
      const response = await fetch('/api/generateFrame', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: finalPrompt }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Use the error message from the API if available, otherwise a generic one
        throw new Error(data.error || 'Не вдалося згенерувати зображення')
      }
      
      setImageUrl(data.imageUrl)

    } catch (err: any) {
      console.error('Error:', err)
      setError(err.message || 'Сталася неочікувана помилка')
    } finally {
      setIsLoading(false)
    }
  }

  const renderTextInput = (label: string, id: string, value: string, setter: (val: string) => void, placeholder: string, isTextArea: boolean = false) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {isTextArea ? (
        <textarea
          id={id}
          name={id}
          rows={3}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setter(e.target.value)}
        />
      ) : (
        <input
          type="text"
          id={id}
          name={id}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setter(e.target.value)}
        />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900">
            Генератор Зображень зі Знімального Брифу
          </h1>
           <p className="mt-2 text-lg text-gray-600">
            Опишіть вашу сцену, використовуючи деталі брифу нижче.
          </p>
        </div>
        
        <form onSubmit={handleSearch} className="bg-white p-8 rounded-lg shadow-lg space-y-8">
          
          <div>
            <label htmlFor="mainPrompt" className="block text-lg font-semibold text-gray-800 mb-2">Основний Запит/Сюжет Зображення *</label>
             <textarea
                id="mainPrompt"
                name="mainPrompt"
                rows={3}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Важливо: Опишіть основний сюжет або дію (напр., \'жінка медитує на світанку на горі\')"
                value={mainPrompt}
                onChange={(e) => setMainPrompt(e.target.value)}
                required
              />
              <p className="mt-1 text-xs text-gray-500">Це найважливіша частина запиту.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <fieldset className="border p-4 rounded-md">
                <legend className="text-lg font-medium text-gray-900 mb-3">1. Загальний Огляд</legend>
                <div className="space-y-4">
                    {renderTextInput("Тип Проєкту", "projectType", projectType, setProjectType, "Напр., Подкаст, Реклама, Туторіал")}
                    {renderTextInput("Тема/Концепція Відео", "videoTheme", videoTheme, setVideoTheme, "Напр., Професійна, Художня, Гумористична")}
                    {renderTextInput("Тон Відео", "videoTone", videoTone, setVideoTone, "Напр., Бадьорий, Серйозний, Навчальний")}
                </div>
            </fieldset>

            <fieldset className="border p-4 rounded-md">
                <legend className="text-lg font-medium text-gray-900 mb-3">2. Візуальний Стиль</legend>
                 <div className="space-y-4">
                    {renderTextInput("Палітра Кольорів", "colorPalette", colorPalette, setColorPalette, "Напр., Яскраві, Приглушені, Брендові")}
                    {renderTextInput("Стиль Освітлення", "lightingStyle", lightingStyle, setLightingStyle, "Напр., Світле, Драматичні тіні, Природне")}
                    {renderTextInput("Ракурси Камери", "cameraAngles", cameraAngles, setCameraAngles, "Напр., Крупні плани, Широкі, Зверху")}
                    {renderTextInput("Композиція/Кадрування", "composition", composition, setComposition, "Напр., Правило третин, По центру, Повний зріст")}
                    {renderTextInput("Настрій/Атмосфера", "moodAtmosphere", moodAtmosphere, setMoodAtmosphere, "Напр., Енергійний, Спокійний, Ностальгічний")}
                    {renderTextInput("Рух Камери", "cameraMovement", cameraMovement, setCameraMovement, "Напр., Плавний, Ручна камера, Статичний")}
                 </div>
            </fieldset>
          </div>
          
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <fieldset className="border p-4 rounded-md">
                <legend className="text-lg font-medium text-gray-900 mb-3">3. Локація та Фон</legend>
                <div className="space-y-4">
                    {renderTextInput("Деталі Локації", "settingDetails", settingDetails, setSettingDetails, "Напр., Мінімалістичний інтер\'єр, Природа, Індастріал", true)}
                    {renderTextInput("Фон/Оточення", "backgrounds", backgrounds, setBackgrounds, "Напр., Однотонний фон, Місто, Офіс", true)}
                </div>
            </fieldset>

             <fieldset className="border p-4 rounded-md">
                <legend className="text-lg font-medium text-gray-900 mb-3">4. Учасники та Стилізація</legend>
                <div className="space-y-4">
                    {renderTextInput("Учасники", "participants", participants, setParticipants, "Напр., Актори, Ведучі, Моделі, Тварини")}
                    {renderTextInput("Гардероб", "wardrobe", wardrobe, setWardrobe, "Напр., Діловий, Кежуал, Брендований одяг")}
                    {renderTextInput("Зачіска та Макіяж", "hairMakeup", hairMakeup, setHairMakeup, "Напр., Натуральний, Вечірній, Вінтаж")}
                 </div>
            </fieldset>
           </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition duration-150 ease-in-out"
            >
              {isLoading ? 'Генерація Зображення...' : 'Згенерувати Зображення'}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative shadow" role="alert">
            <strong className="font-bold">Помилка!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {imageUrl && (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">Згенероване Зображення</h2>
            <div className="bg-white shadow-xl rounded-lg overflow-hidden p-4 border border-gray-200">
              <img 
                src={imageUrl} 
                alt={mainPrompt.trim() || 'Згенероване зображення на основі брифу'} 
                className="w-full h-auto object-contain rounded"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 