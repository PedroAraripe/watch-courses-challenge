import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { clearCourse, getCourses } from "../../store/courses";

import ContainerSpacement from '../../common/components/ContainerSpacement';
import Pagination from '../../common/components/Paginator';
import DropdownCategories from '../../common/components/DropdownCategories';
import CardCoursePreview from '../../common/components/CardCoursePreview';

import { perPage } from '../../common/constants/pagination';
import { MainTitle } from '../../common/styles';
import NotFoundSearch from '../../common/components/NotFoundSearch';

import { courses as coursesData } from "../../store/courses"

export default function Home () {
    const courseState = useSelector((state) => state.courses.courses);
    const courses = courseState.items;
    const dispatch = useDispatch();

    const userCredentials = useSelector((state) => state.user.value.user);
    const isAdmin = userCredentials?.role === "admin";

    const [searchParams] = useSearchParams();
    const searchParam = searchParams.get('s');
    const currentPage = searchParams.get('page') || 1;
    const category = searchParams.get('category');

    const start = currentPage * perPage - perPage;
    const end = start + perPage;

    useEffect(() => {
        dispatch(getCourses({start, end, category, search: searchParam}));
    }, [category, currentPage, searchParam, coursesData]);
    
    return (
        <ContainerSpacement>
            <div className="d-flex flex-column align-items-center">
                <div>
                    <MainTitle fw="800">
                        Resultados da Pesquisa por: {searchParam}
                    </MainTitle>
                    
                    <DropdownCategories />

                    {isAdmin ? (
                        <button 
                            onClick={() => dispatch(clearCourse())}
                            className="btn btn-success mt-3"
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal"
                        >
                            Criar curso
                        </button>
                    ): null}
                </div>

                <div className="py-5"></div>

                <div className="row w-100">
                    {courses.length ? (
                        courses.map((course, index) =>(
                            <div className='col-lg-4' key={index}>
                                <CardCoursePreview
                                    id={course.id}
                                    name={course.name}
                                    description={course.description}
                                 />
                            </div>
                        )) 
                    ): (
                        <NotFoundSearch />
                    )}
                </div>

                <Pagination
                    totalItems={courseState.total}
                    currentPage={currentPage}
                />
            </div>
        </ContainerSpacement>
    )
  }