// import React from 'react';
import { Formik, Form } from 'formik';
import { items } from '../utils/data'; // Make sure to paste your full array here

const groupItems = (items) => {
  const grouped = {};
  items.map(item => {
    const category = item.category?.name || 'Uncategorized';
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push(item);
  });
  return grouped;
};

const Task = () => {
  const groupedItems = groupItems(items);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-gray-100 shadow-md rounded-xl p-6">
        <h2 className="text-2xl font-bold text-blue-800 mb-6">Tax Resource Form</h2>
        <Formik
          initialValues={{ applicable_items: [] }}
          onSubmit={(values) => {
            const appliedTo = values.applicable_items.length === items.length ? 'all' : 'some';
            console.log('applied_to:', appliedTo);
            console.log('Selected item IDs:', values.applicable_items);
          }}
        >
          {({ values, setFieldValue }) => (
            <Form className="space-y-8">
              {Object.entries(groupedItems).map(([category, categoryItems]) => {
                const allChecked = categoryItems.every(item =>
                  values.applicable_items.includes(item.id)
                );

                const toggleCategory = (checked) => {
                  const updated = [...values.applicable_items];
                  categoryItems.forEach(item => {
                    const idx = updated.indexOf(item.id);
                    if (checked && idx === -1) updated.push(item.id);
                    if (!checked && idx !== -1) updated.splice(idx, 1);
                  });
                  setFieldValue('applicable_items', updated);
                };

                return (
                  <div key={category} className="space-y-3">
                    
                    <label className="flex items-center bg-gray-200 px-3 py-2 rounded-lg font-medium text-gray-700 text-base sm:text-lg">
                      <input
                        type="checkbox"
                        className="mr-3 h-5 w-5 text-blue-600"
                        checked={allChecked}
                        onChange={(e) => toggleCategory(e.target.checked)}
                      />
                      {category}
                    </label>

  
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-6">
                      {categoryItems.map(item => (
                        <label
                          key={item.id}
                          className="flex items-center bg-gray-50 border rounded-md px-3 py-2 hover:bg-gray-100 transition"
                        >

                            <img
                            src={item.images[0]?.url}
                            alt={item.name}
                            className="w-10 h-10 rounded-md mr-3"
                            onError={(e) => {
                              e.target.onerror = null; 
                              e.target.src = 'https://via.placeholder.com/40'; 
                            }}
                            />

                          <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-500"
                            checked={values.applicable_items.includes(item.id)}
                            onChange={(e) => {
                              const selected = [...values.applicable_items];
                              const index = selected.indexOf(item.id);
                              if (e.target.checked && index === -1) selected.push(item.id);
                              if (!e.target.checked && index !== -1) selected.splice(index, 1);
                              setFieldValue('applicable_items', selected);
                            }}
                          />
                          <span className="ml-2 text-sm text-gray-800">{item.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}

              <button
                type="submit"
                className="w-full sm:w-auto mt-6 bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition"
              >
                Apply to {values.applicable_items.length} item
                {values.applicable_items.length !== 1 && 's'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Task;
